const {
    evmosUnsigned,
    evmosMantissa,
    both
  } = require('../Utils/EVMOS');
  
  const {fastForward, makeNToken, setMarketSupplyCap} = require('../Utils/Nemo');
  
  const factor = evmosMantissa(.02);
  
  const reserves = evmosUnsigned(3e12);
  const cash = evmosUnsigned(reserves.mul(2));
  const reduction = evmosUnsigned(2e12);
  
  describe('NToken', function () {
    let root, accounts;
    beforeEach(async () => {
      [root, ...accounts] = saddle.accounts;
    });
  
    describe('_setReserveFactorFresh', () => {
      let nToken;
      beforeEach(async () => {
        nToken = await makeNToken();
        await setMarketSupplyCap(nToken.comptroller, [nToken._address], [100000000000]);
      });
  
      it("rejects change by non-admin", async () => {
        expect(
          await send(nToken, 'harnessSetReserveFactorFresh', [factor], {from: accounts[0]})
        ).toHaveTokenFailure('UNAUTHORIZED', 'SET_RESERVE_FACTOR_ADMIN_CHECK');
        expect(await call(nToken, 'reserveFactorMantissa')).toEqualNumber(0);
      });
  
      it("rejects change if market not fresh", async () => {
        expect(await send(nToken, 'harnessFastForward', [5])).toSucceed();
        expect(await send(nToken, 'harnessSetReserveFactorFresh', [factor])).toHaveTokenFailure('MARKET_NOT_FRESH', 'SET_RESERVE_FACTOR_FRESH_CHECK');
        expect(await call(nToken, 'reserveFactorMantissa')).toEqualNumber(0);
      });
  
      it("rejects newReserveFactor that descales to 1", async () => {
        expect(await send(nToken, 'harnessSetReserveFactorFresh', [evmosMantissa(1.01)])).toHaveTokenFailure('BAD_INPUT', 'SET_RESERVE_FACTOR_BOUNDS_CHECK');
        expect(await call(nToken, 'reserveFactorMantissa')).toEqualNumber(0);
      });
  
      it("accepts newReserveFactor in valid range and emits log", async () => {
        const result = await send(nToken, 'harnessSetReserveFactorFresh', [factor])
        expect(result).toSucceed();
        expect(await call(nToken, 'reserveFactorMantissa')).toEqualNumber(factor);
        expect(result).toHaveLog("NewReserveFactor", {
          oldReserveFactorMantissa: '0',
          newReserveFactorMantissa: factor.toString(),
        });
      });
  
      it("accepts a change back to zero", async () => {
        const result1 = await send(nToken, 'harnessSetReserveFactorFresh', [factor]);
        const result2 = await send(nToken, 'harnessSetReserveFactorFresh', [0]);
        expect(result1).toSucceed();
        expect(result2).toSucceed();
        expect(result2).toHaveLog("NewReserveFactor", {
          oldReserveFactorMantissa: factor.toString(),
          newReserveFactorMantissa: '0',
        });
        expect(await call(nToken, 'reserveFactorMantissa')).toEqualNumber(0);
      });
    });
  
    describe('_setReserveFactor', () => {
      let nToken;
      beforeEach(async () => {
        nToken = await makeNToken();
      });
  
      beforeEach(async () => {
        await send(nToken.interestRateModel, 'setFailBorrowRate', [false]);
        await send(nToken, '_setReserveFactor', [0]);
      });
  
      it("emits a reserve factor failure if interest accrual fails", async () => {
        await send(nToken.interestRateModel, 'setFailBorrowRate', [true]);
        await fastForward(nToken, 1);
        await expect(send(nToken, '_setReserveFactor', [factor])).rejects.toRevert("revert INTEREST_RATE_MODEL_ERROR");
        expect(await call(nToken, 'reserveFactorMantissa')).toEqualNumber(0);
      });
  
      it("returns error from setReserveFactorFresh without emitting any extra logs", async () => {
        const {reply, receipt} = await both(nToken, '_setReserveFactor', [evmosMantissa(2)]);
        expect(reply).toHaveTokenError('BAD_INPUT');
        expect(receipt).toHaveTokenFailure('BAD_INPUT', 'SET_RESERVE_FACTOR_BOUNDS_CHECK');
        expect(await call(nToken, 'reserveFactorMantissa')).toEqualNumber(0);
      });
  
      it("returns success from setReserveFactorFresh", async () => {
        expect(await call(nToken, 'reserveFactorMantissa')).toEqualNumber(0);
        expect(await send(nToken, 'harnessFastForward', [5])).toSucceed();
        expect(await send(nToken, '_setReserveFactor', [factor])).toSucceed();
        expect(await call(nToken, 'reserveFactorMantissa')).toEqualNumber(factor);
      });
    });
  
    describe("_reduceReservesFresh", () => {
      let nToken;
      beforeEach(async () => {
        nToken = await makeNToken();
        expect(await send(nToken, 'harnessSetTotalReserves', [reserves])).toSucceed();
        expect(
          await send(nToken.underlying, 'harnessSetBalance', [nToken._address, cash])
        ).toSucceed();
      });
  
      it("fails if called by non-admin", async () => {
        expect(
          await send(nToken, 'harnessReduceReservesFresh', [reduction], {from: accounts[0]})
        ).toHaveTokenFailure('UNAUTHORIZED', 'REDUCE_RESERVES_ADMIN_CHECK');
        expect(await call(nToken, 'totalReserves')).toEqualNumber(reserves);
      });
  
      it("fails if market not fresh", async () => {
        expect(await send(nToken, 'harnessFastForward', [5])).toSucceed();
        expect(await send(nToken, 'harnessReduceReservesFresh', [reduction])).toHaveTokenFailure('MARKET_NOT_FRESH', 'REDUCE_RESERVES_FRESH_CHECK');
        expect(await call(nToken, 'totalReserves')).toEqualNumber(reserves);
      });
  
      it("fails if amount exceeds reserves", async () => {
        expect(await send(nToken, 'harnessReduceReservesFresh', [reserves.add(1)])).toHaveTokenFailure('BAD_INPUT', 'REDUCE_RESERVES_VALIDATION');
        expect(await call(nToken, 'totalReserves')).toEqualNumber(reserves);
      });
  
      it("fails if amount exceeds available cash", async () => {
        const cashLessThanReserves = reserves.sub(2);
        await send(nToken.underlying, 'harnessSetBalance', [nToken._address, cashLessThanReserves]);
        expect(await send(nToken, 'harnessReduceReservesFresh', [reserves])).toHaveTokenFailure('TOKEN_INSUFFICIENT_CASH', 'REDUCE_RESERVES_CASH_NOT_AVAILABLE');
        expect(await call(nToken, 'totalReserves')).toEqualNumber(reserves);
      });
  
      it("increases admin balance and reduces reserves on success", async () => {
        const balance = evmosUnsigned(await call(nToken.underlying, 'balanceOf', [root]));
        expect(await send(nToken, 'harnessReduceReservesFresh', [reserves])).toSucceed();
        expect(await call(nToken.underlying, 'balanceOf', [root])).toEqualNumber(balance.add(reserves));
        expect(await call(nToken, 'totalReserves')).toEqualNumber(0);
      });
  
      it("emits an event on success", async () => {
        const result = await send(nToken, 'harnessReduceReservesFresh', [reserves]);
        expect(result).toHaveLog('ReservesReduced', {
          admin: root,
          reduceAmount: reserves.toString(),
          newTotalReserves: '0'
        });
      });
    });
  
    describe("_reduceReserves", () => {
      let nToken;
      beforeEach(async () => {
        nToken = await makeNToken();
        await send(nToken.interestRateModel, 'setFailBorrowRate', [false]);
        expect(await send(nToken, 'harnessSetTotalReserves', [reserves])).toSucceed();
        expect(
          await send(nToken.underlying, 'harnessSetBalance', [nToken._address, cash])
        ).toSucceed();
      });
  
      it("emits a reserve-reduction failure if interest accrual fails", async () => {
        await send(nToken.interestRateModel, 'setFailBorrowRate', [true]);
        await fastForward(nToken, 1);
        await expect(send(nToken, '_reduceReserves', [reduction])).rejects.toRevert("revert INTEREST_RATE_MODEL_ERROR");
      });
  
      it("returns error from _reduceReservesFresh without emitting any extra logs", async () => {
        const {reply, receipt} = await both(nToken, 'harnessReduceReservesFresh', [reserves.add(1)]);
        expect(reply).toHaveTokenError('BAD_INPUT');
        expect(receipt).toHaveTokenFailure('BAD_INPUT', 'REDUCE_RESERVES_VALIDATION');
      });
  
      it("returns success code from _reduceReservesFresh and reduces the correct amount", async () => {
        expect(await call(nToken, 'totalReserves')).toEqualNumber(reserves);
        expect(await send(nToken, 'harnessFastForward', [5])).toSucceed();
        expect(await send(nToken, '_reduceReserves', [reduction])).toSucceed();
      });
    });
  });