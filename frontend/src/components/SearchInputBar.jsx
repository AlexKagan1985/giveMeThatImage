import classes from "./SearchInputBar.module.scss"

function SearchInputBar({value, setValue}) {
  return (
    <div className={classes["input-group"]}>
      <i className="fa-solid fa-magnifying-glass"></i>
      <input type="text" value={value} onChange={(e) => setValue(e.target.value)} />
      <button type="submit">Search</button>
    </div>
  )
}

export default SearchInputBar;