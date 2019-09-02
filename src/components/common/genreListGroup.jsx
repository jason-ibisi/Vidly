import React from 'react';

const GenreListGroup = ({
  items,
  textProperty,
  valueProperty,
  selectedItem,
  onItemSelect
}) => {
  return (
    <ul className="list-group">
      {items.map(item => (
        <li
          key={item[valueProperty]}
          onClick={() => onItemSelect(item)}
          className={
            item === selectedItem || (!selectedItem && !item[valueProperty])
              ? 'list-group-item active'
              : 'list-group-item'
          }
        >
          {item[textProperty]}
        </li>
      ))}
    </ul>
  );
};

GenreListGroup.defaultProps = {
  textProperty: 'name',
  valueProperty: '_id'
};

export default GenreListGroup;
