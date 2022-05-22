import { useAppDispatch, useAppSelector } from '../../hooks';
import { decrement, increment, incrementWithDelay, selectCountLoading } from './counterSlice';

export function Counter(): JSX.Element {
  const count = useAppSelector((state) => state.counter.value);
  const loading = useAppSelector(selectCountLoading);
  const dispatch = useAppDispatch();

  return (
    <div>
      <div>
        <button aria-label="Increment value" disabled={loading === 'pending'} onClick={() => dispatch(increment())}>
          Increment
        </button>
        <button
          aria-label="Increment value with delay"
          disabled={loading === 'pending'}
          onClick={() => dispatch(incrementWithDelay())}
        >
          Increment With Delay
        </button>
        <span>{count}</span>
        <button aria-label="Decrement value" disabled={loading === 'pending'} onClick={() => dispatch(decrement())}>
          Decrement
        </button>
      </div>
    </div>
  );
}
