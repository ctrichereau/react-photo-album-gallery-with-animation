function Item({ label, checked, onChange }) {
  return (
    <li>
      <label>
        <input type="checkbox" checked={checked} onChange={onChange} />
        {label}
      </label>
    </li>
  );
}

export default function Filter({ tags, selected, onChange }) {
  const handleChange = (tag) => (event) => {
    const result = [...selected.filter((item) => item !== tag)];
    if (event.target.checked) {
      result.push(tag);
    }
    onChange(result);
  };

  const allSelected = !Boolean(tags.find((tag) => !selected.includes(tag)));

  const handleAllChange = (event) => {
    onChange(event.target.checked ? [...tags] : []);
  };

  return (
    <ul className="Filter">
      <Item label="All" checked={allSelected} onChange={handleAllChange} />

      {tags.map((tag) => (
        <Item
          key={tag}
          label={tag}
          checked={selected.includes(tag)}
          onChange={handleChange(tag)}
        />
      ))}
    </ul>
  );
}
