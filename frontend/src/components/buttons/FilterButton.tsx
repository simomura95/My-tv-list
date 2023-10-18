type props = {
  filterTitle: string,
  setFilterTitle: React.Dispatch<React.SetStateAction<string>>,
  orderBy: string,
  setOrderBy: React.Dispatch<React.SetStateAction<string>>,
  orderDirection: number,
  setOrderDirection: React.Dispatch<React.SetStateAction<number>>
}

const FilterButton = (props: props) => {
  const { filterTitle, setFilterTitle, orderBy, setOrderBy, orderDirection, setOrderDirection } = props
  return (
    <div className="d-flex flex-column gap-2">
    {/* Filter button */}
    <button className='btn btn-outline-secondary ms-sm-auto' type="button" data-bs-toggle="collapse" data-bs-target="#filterOptions" aria-expanded="false" aria-controls="collapseFilter">Filter</button>

    {/* Filter options */}
    <div className="collapse" id="filterOptions">
      <div className="card card-body">
        <div className='d-flex'>
          <div className='me-3'>
            <input
              type="text"
              className="form-control"
              id="filterByTitle"
              placeholder='Filter by movie title'
              value={filterTitle}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFilterTitle(e.target.value)} />
          </div>
          <div>
            <div className="form-check">
              <input className="form-check-input" type="radio" name="orderOptions" id="orderByAddDate" onChange={(e) => e.target.checked && setOrderBy('ADD_DATE')} checked={orderBy === 'ADD_DATE'} />
              <label className="form-check-label" htmlFor="orderByAddDate">
                Add date
              </label>
            </div>
            <div className="form-check">
              <input className="form-check-input" type="radio" name="orderOptions" id="orderByTitle" onChange={(e) => e.target.checked && setOrderBy('TITLE')} checked={orderBy === 'TITLE'} />
              <label className="form-check-label" htmlFor="orderByTitle">
                Title
              </label>
            </div>
            <div className="form-check">
              <input className="form-check-input" type="radio" name="orderOptions" id="orderByReleaseDate" onChange={(e) => e.target.checked && setOrderBy('RELEASE_DATE')} checked={orderBy === 'RELEASE_DATE'} />
              <label className="form-check-label" htmlFor="orderByReleaseDate">
                      Release date
              </label>
            </div>
            <div className="form-check">
              <input className="form-check-input" type="radio" name="orderOptions" id="orderByRating" onChange={(e) => e.target.checked && setOrderBy('RATING')} checked={orderBy === 'RATING'} />
              <label className="form-check-label" htmlFor="orderByRating">
                Rating
              </label>
            </div>
            <div className={`form-check form-switch ${orderDirection < 0 ? "me-3" : "me-2"}`}>
              <input className="form-check-input" type="checkbox" role="switch" id="orderDirection" onChange={() => setOrderDirection(-orderDirection)}/>
              <label className="form-check-label" htmlFor="orderDirection">{orderDirection < 0 ? "Ascending" : "Descending"} order</label>
            </div>
          </div>
        </div>
      </div>
    </div>

    </div>
  )
}

export default FilterButton