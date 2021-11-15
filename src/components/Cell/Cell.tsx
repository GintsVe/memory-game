import './Cell.scss';
import { FC, useEffect, useState } from 'react';

type CellProps = {
    value: number,
    cellClickHandler: () => void,
    clicked: boolean
}

const Cell: FC<CellProps> = ({ value, cellClickHandler, clicked }) => {
  const [cellValue, setCellValue] = useState('');

  useEffect(() => {
    if (clicked) {
      setCellValue(String(value));
    } else {
      (
        setCellValue('')
      );
    }
  }, [clicked]);

  const clickHandler = () => {
    cellClickHandler();
  };

  return (
    <button disabled={clicked} onClick={clickHandler} className="cell">
      {cellValue}
    </button>
  );
};
export default Cell;
