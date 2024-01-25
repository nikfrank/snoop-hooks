import { useState, useMemo } from 'react';

import '@cloudscape-design/global-styles/index.css';
import DatePicker from '@cloudscape-design/components/date-picker';


import emailRegex from './emailRegex';

import goldRecord from './goldRecord.png';
import snoopAlbums from './snoopAlbums';
import rappers from './rappers';

import countries from './countries';

import './App.scss';

const score = (query='', option)=>
  (
    query
      .split('')
      .reduce((scoreSoFar, c, i)=>
        scoreSoFar + (
          option.toLowerCase().includes( query.slice(0, query.length -i).toLowerCase() ) ?
          query.length - i : 0
        ), -Math.min(10, option.length) + (query[0]?.toLowerCase() === option[0]?.toLowerCase() ? 3 : 0)
  ));

function App() {
  const [rapName, setRapName] = useState('Nate DAWG');
  const [albumSales, setAlbumSales] = useState(4200000);

  const [email, setEmail] = useState('snoop@dogg.pound');
  const isEmailValid = useMemo(()=> emailRegex.test(email), [email]);

  const [job, setJob] = useState('');
  const [topAlbum, setTopAlbum] = useState(null);

  const [topAlbumOpen, setTopAlbumOpen] = useState(false);
  const toggleTopAlbumOpen = ()=> setTopAlbumOpen(open => !open);

  const selectTopAlbum = album => {
    setTopAlbum(album);
    setTopAlbumOpen(false);
  };

  const [topRapper, setTopRapper] = useState(rappers[0]);

  const [countryQuery, setCountryQuery] = useState('');
  const [selectableCountries, setSelectableCountries] = useState([]);

  const selectCountry = (countryName)=> {
    setCountryQuery(countryName);
    setSelectableCountries([]);
  };


  const queryCountries = (query)=>{
    setCountryQuery(query);

    setSelectableCountries(
      countries
        .map(countryName => [countryName, score(query, countryName)])
        .sort((ca, cb)=> cb[1] - ca[1])
        .map(c=> c[0])
        .slice(0,3)
    );
  };


  const [startDate, setStartDate] = useState();
  
  const done = ()=>{
    console.log(rapName, 'is done selling this many units:', albumSales);
  };
  
  return (
    <div className='App'>
      <div className='header'>
        <img src={topRapper.imgSrc} alt={topRapper.name} />
        <ul className='hover-dropdown'>
          <li key='top item'>{topRapper.name}</li>
          {rappers.map(rapper=>(
            <li key={rapper.name} onClick={()=> setTopRapper(rapper)}>{rapper.name}</li>
          ))}
        </ul>
      </div>
      
      <div className='form'>

        <div className='card swanky-input-container'>
          <label>
            <span className='title'>Rap Name</span>
            <input value={rapName} onChange={event=> setRapName(event.target.value)} />
          </label>
        </div>

        <div className='card swanky-input-container'>
          <label>
            <span className='title'>Album Sales</span>
            <input value={albumSales}
                   type='number'
                   step={1000}
                   onChange={event=> setAlbumSales(+event.target.value)} />
          </label>
          <div className='goldRecords'>
            {
              [1,2,3,4]
                .filter(n => n*1000000 <= albumSales)
                .map(n => (
                  <div className='goldRecord' key={n} >
                    <img src={goldRecord} alt='solid gold'/>
                  </div>
                ))
            }
          </div>
        </div>

        <div className='card swanky-input-container'>
          <span className='title'>Email</span>
          <input value={email} onChange={event=> setEmail(event.target.value)} />

          {isEmailValid ? null : (
            <span className='invalid'>Please enter a valid email address</span>
          )}
        </div>

        <div className="card swanky-input-container">
          <label>
            <select onChange={event=> setJob(event.target.value)} value={job}>
              <option value=''>Select Job</option>
              <option value='rapper'>rapper</option>
              <option value='sales'>sales</option>
              <option value='distribution'>distribution</option>
            </select>
            <span className='title'>Job</span>
          </label>
        </div>

        <div className='card swanky-input-container'>
          <span className='title'>Top Album</span>
          <div className='album-dropdown-base' onClick={toggleTopAlbumOpen}>
            {!topAlbum ? (
              <span>Select Top Album</span>
            ):(
              <>
                <img src={topAlbum.cover} alt={topAlbum.name}/>
                <span>{topAlbum.year}</span>
                <span>{topAlbum.name}</span>
              </>
            )}
            <span className='drop-arrow'>{topAlbumOpen ? '▲' : '▼'}</span>
          </div>

          {!topAlbumOpen ? null : (
            <>
              <div className='click-out' onClick={()=> setTopAlbumOpen(false)}/>

              <ul className='selectable-albums'>
                {snoopAlbums.map(({ name, year, cover })=> (
                  <li key={name} onClick={()=> selectTopAlbum({ name, year, cover })}>
                    <img src={cover} alt={name}/>
                    <span>{year}</span>
                    <span>{name}</span>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>

        <div className='card swanky-input-container'>
          <div className='country-dropdown-base'>
            <input
              value={countryQuery}
              onChange={event=> queryCountries(event.target.value)}
              onFocus={()=> queryCountries(countryQuery)}
            />

            <span className='title'>Country</span>

            {selectableCountries.length ? (
              <>
                <ul className='selectable-countries'>
                  {selectableCountries.map(countryName=> (
                    <li key={countryName} onClick={()=> selectCountry(countryName)}>
                      {countryName}
                    </li>
                  ))}
                </ul>
                <div className='click-out' onClick={()=> setSelectableCountries([])}/>
              </>
            ): null}
          </div>
        </div>


        <div className='card swanky-input-container centering'>

          <span className='title'>Start Date</span>
          
          <DatePicker
            onChange={(event) => setStartDate(event.detail.value)}
            value={startDate}
            placeholder="YYYY/MM/DD"
          />
        </div>
        
        <div className='done-container'>
          <button onClick={done} className='done-button'>
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
