import './App.scss';
import { useEffect, useRef, useState } from 'react';
import difficulty from './data/difficulty';
import Cell from './components/Cell/Cell';

type FieldValueTypes = {
  value: number,
  clicked: boolean
}

const App = () => {
  const [selectedLevel, setSelectedLevel] = useState('easy');
  const [field, setField] = useState<FieldValueTypes[]>([]);
  const [fieldWidth, setFieldWidth] = useState(0);
  const [clickedCellsValues, setClickedCellsValues] = useState<number[]>([]);

  const ref = useRef(false);

  useEffect(() => {
    const clicked = field.filter((x) => !x.clicked);

    if (!ref.current) {
      ref.current = true;
    } else if (clicked.length === 0) {
      const timeout = setTimeout(() => alert('YOU WON'), 100);

      return () => clearTimeout(timeout);
    }
    return () => ({});
  }, [field]);

  const createField = () => {
    const levelSelected = difficulty.filter(({ level }) => level === selectedLevel);
    const { height } = levelSelected[0];
    const { width } = levelSelected[0];
    const createdField = [];
    const cellCount = height * width;
    const cellValues = Array.from(Array(cellCount).keys());

    const shuffle = (array: object[]) => {
      for (let i = array.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        // eslint-disable-next-line no-param-reassign
        [array[i], array[j]] = [array[j], array[i]];
      }
    };

    for (let i = 0; i < cellCount / 2; i += 1) {
      createdField.push({ value: cellValues[i], clicked: false });
      createdField.push({ value: cellValues[i], clicked: false });
    }

    shuffle(createdField);

    setFieldWidth(width);

    setField(createdField);
  };

  const revealHideClicked = (index: number) => {
    const newField = (field.map((item, i) => {
      if (i === index) {
        return { ...item, clicked: true };
      }
      return item;
    }));

    if (clickedCellsValues.length === 2) {
      setField(newField.map((item, i) => {
        if ((item.value === clickedCellsValues[0] || item.value === clickedCellsValues[1])
          && clickedCellsValues[0] !== clickedCellsValues[1] && i !== index) {
          return { ...item, clicked: false };
        }
        return item;
      }));
    } else {
      setField(newField);
    }
  };

  const cellClickHandler = (index: number) => {
    if (clickedCellsValues.length === 2) {
      revealHideClicked(index);
      setClickedCellsValues([field[index].value]);
    } else {
      revealHideClicked(index);
      setClickedCellsValues((prevState) => [...prevState, field[index].value]);
    }
  };

  const cellKeys = Array.from(Array(field.length).keys());

  return (
    <div className="memory-game">
      <select name="select" onChange={(e) => { setSelectedLevel(e.target.value); }}>
        {
          difficulty.map(({ level }) => (
            <option key={level} value={level}>{level}</option>
          ))
        }
      </select>
      <button onClick={() => {
        createField();
        setClickedCellsValues([]);
      }}
      >
        Select
      </button>
      <div style={{ width: 40 * fieldWidth }} className="game-field">
        {
          field.map(({ value, clicked }, index) => (
            <Cell
              key={cellKeys[index]}
              cellClickHandler={() => cellClickHandler(index)}
              value={value}
              clicked={clicked}
            />
          ))
        }
      </div>
    </div>
  );
};

export default App;
