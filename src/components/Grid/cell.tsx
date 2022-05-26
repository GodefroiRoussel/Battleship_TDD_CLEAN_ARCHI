export enum TYPE_COORDINATE_CELL {
  ALREADY_SHOT = 'ALREADY_SHOT',
  WATER = 'WATER',
  OCCUPIED = 'OCCUPIED',
  FUTURE = 'FUTURE',
  OVERLAPSE = 'OVERLAPSE',
  PLOUF = 'PLOUF',
  TOUCHED = 'TOUCHED',
  UNKNOWN = 'UNKNOWN',
  TO_SHOOT = 'TO_SHOOT',
}

export const Cell = ({ id, typeCoordinate }: { id: string; typeCoordinate: TYPE_COORDINATE_CELL }): JSX.Element => {
  let text: string;
  let style = {
    border: 'solid',
    width: '100%',
    display: 'flex',
    flex: 1,
    backgroundColor: 'blue',
    minHeight: '5vh',
    justifyContent: 'center',
    alignItems: 'center',
  };
  switch (typeCoordinate) {
    case TYPE_COORDINATE_CELL.ALREADY_SHOT:
      style = { ...style, backgroundColor: 'purple' };
      text = TYPE_COORDINATE_CELL.ALREADY_SHOT;
      break;
    case TYPE_COORDINATE_CELL.UNKNOWN:
      style = { ...style, backgroundColor: 'grey' };
      text = TYPE_COORDINATE_CELL.UNKNOWN;
      break;
    case TYPE_COORDINATE_CELL.OCCUPIED:
      style = { ...style, backgroundColor: 'grey' };
      text = TYPE_COORDINATE_CELL.OCCUPIED;
      break;

    case TYPE_COORDINATE_CELL.FUTURE:
      style = { ...style, backgroundColor: 'green' };
      text = TYPE_COORDINATE_CELL.FUTURE;
      break;
    case TYPE_COORDINATE_CELL.TO_SHOOT:
      style = { ...style, backgroundColor: 'green' };
      text = TYPE_COORDINATE_CELL.TO_SHOOT;
      break;

    case TYPE_COORDINATE_CELL.TOUCHED:
      style = { ...style, backgroundColor: 'red' };
      text = TYPE_COORDINATE_CELL.TOUCHED;
      break;
    case TYPE_COORDINATE_CELL.OVERLAPSE:
      style = { ...style, backgroundColor: 'red' };
      text = TYPE_COORDINATE_CELL.OVERLAPSE;
      break;

    case TYPE_COORDINATE_CELL.PLOUF:
      style = { ...style, backgroundColor: 'cyan' };
      text = TYPE_COORDINATE_CELL.PLOUF;
      break;

    default:
      text = TYPE_COORDINATE_CELL.WATER;
      break;
  }

  return (
    <div key={id} style={style} id={id}>
      {text}
    </div>
  );
};
