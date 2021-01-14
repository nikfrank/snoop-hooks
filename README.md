<a name="thatop"></a>
# forms & user input in react: snoop jobs NOW WITH HOOKS

Snoop wants us to build him a job application form, and he wants it to be **fresh**

Agenda:

- [step 1: on the button](#step1)
- [step 2: give'm what they want - text input](#step2)
- [step 3: break'm off somethin - drop downs](#step3)
- [step 4: and it's gotta be bumpin - refactor to components](#step4)
- [step 5: city of compton - notifications and animations](#step5)


## getting started

`$ npx create-react-app snoop-jobs`

`$ cd snoop-jobs`

`$ npm start`

you now have the default create-react-app starter running in your browser and can edit the `src` files live

you might be familiar with class components react, and are interested in learning to use hooks. I won't focus too much on how JSX works or ES6 features, but rather mostly on hooks. The class component react version of this lesson is available (also in Russian) [here](https://github.com/nikfrank/react-workshop-snoop) and covers those topics


<a name="step1"></a>
## step 1: on the button

<img src='http://3.bp.blogspot.com/-wojpCbgYsz8/UB9hbJnCo_I/AAAAAAAABlk/GHXo4H9vFck/s1600/Snoop-Doggy-Dogg-24.jpg' height=250 width=325/>

Uncle Snoop wants to make sure we can get events from the user. First thing's first - we need a `<button>` for them to press. You might say it's a bit backwards to start with a done button, but you know how Snoop likes to flip the script.


<sub>./src/App.js</sub>
```js
import './App.css';

const App = ()=> {
  return (
    <div className='App'>
      <button> Done </button>
    </div>
  );
}

export default App;
```

and let's give it a function to call, using a fat arrow to log out a message `'done'` (just to test that our button works)

<sub>./src/App.js</sub>
```js
import './App.css';

const App = ()=> {
  const done = ()=>{
    console.log('done');
  }
  
  return (
    <div className='App'>
      <button onClick={done}> Done </button>
    </div>
  );
}

export default App;
```

`const done = ()=> { console.log('done') }` is defining `done` as a function newly on every render. We're working in a functional paradigm in 2020, so making functions is all we do. We'll see later this is necessary to make sure we use updated variable values.

what we'll be doing in this workshop is learning to get user values into reactive variables, so let's use a state and log it out in `done`

if you want a quick lace up on hooks basics, [check out the docs](https://reactjs.org/docs/hooks-intro.html)


<sub>./src/App.js</sub>
```js
import { useState } from 'react';
import './App.css';

const App = ()=> {
  const [rapName, setRapName] = useState('Killer Mike');
  const [albumSales, setAlbumSales] = useState(4200000);
  
  const done = ()=>{
    console.log(rapName, 'is done selling this many units:', albumSales);
  };
  
  return (
    <div className='App'>
      <button onClick={done}> Done </button>
    </div>
  );
}

export default App;
```

The syntax of the `useState` call is probably foreign if you're new to hooks, so let's break it down

on the left of the assignment `=`, we have `const [rapName, setRapName]`

`const` - used to define unchanging variables. here, during each render, the `rapName` will not change. If we change it, it will already be the next render!

`[rapName, setRapName]` - `useState` returns an array with two values (covered next), we want to [destructure](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment) those values into each their own variable.

each of our `useState` calls is making a new reactive variable - when it changes, our `App` will render. We can name it whatever we want very easily, as it is returned in an array and we destructure positionally

each of our `useState` calls is giving us a setter function, which we can call with a new value for the variable. Here we follow the convention of naming this function `setWhateverOurVariableNameWasButTheWholeThingIsInCamelCase`

and on the right side

`useState('Killer Mike')` - we call the `useState` hook, passing in an initial value

we're showing some respect to [the big man from ATL](https://en.wikipedia.org/wiki/Killer_Mike) - IF YOU'RE LIVING IN GA, REMEMBER TO VOTE IN THE SENATE RUNOFFS IN JANUARY

everything is exactly the same for our `albumSales` variable and its setter `setAlbumSales`, execpt of course that its initial value is a number (no surprise there Killer Mike is killing it quadruple platinum)

---

now we can throw some SCSS sauce on there and it'll be good to go

first, let's [enable scss by following these super simple instructions](https://create-react-app.dev/docs/adding-a-sass-stylesheet/)

and renaming <sub>./src/App.css</sub> to <sub>./src/App.scss</sub> (and fixing the `import` statement)

<sub>./src/App.js</sub>

```js
//...
import './App.scss';
```

```html
        <button onClick={done} className='done-button'> Done </button>
```

<sub>./src/App.scss</sub>
```scss
//...

.done-button {
  background-color: white;
  padding: 15px;
  margin: 10px 0;
  font-size: 24px;
  border-radius: 5px;
  user-select: none;
}
```

we'll also (often) want to get rid of that pesky outine (mine is orange) once we've clicked on the `<button/>`

the way we'll do that is by styling on the `:focus` [pseudoselector](https://www.w3schools.com/css/css_pseudo_classes.asp) (as clicking the `<button/>` leaves it in the `:focus` state)

```scss
.done-button {
  // ... styles we had before

  &:focus {
    outline: none;
  }
}
```

anyone who's new to SCSS should [check out CSS-tricks page](https://css-tricks.com/the-sass-ampersand/) about nesting selectors

this is one of the huge advantages of SCSS for keeping our rules well organized

---

[back to the top](#thatop)

---


<a name="step2"></a>
## step 2: give'm what they want - text input

### editing the rap name

we have a `rapName` listed in our `state`, now it's time to let the user update it

first we'll render an `<input />` element with the value in it

<sub>./src/App.js</sub>
```js
//...

    <div className='App'>
      <input value={rapName} />
      <button onClick={done} className='done-button'> Done </button>
    </div>

//...
```

so that's great if the value never changes, but Snoop wants the user's input to be set in the `rapName` reactive state variable so it can be rendered back to the user!

we learned already that everything that changes that the user sees has to be reactive (aka "programming in REACT")

So every time the user types even one character, we need to call our setter with the new value - only then it can render to the user.


To take text input from a user, we're going to put an `onChange` eventHandler function on our `<input />` which sets the new value by calling the setter we got back from `useState`

This pattern is standard in React and goes by the name: [controlled input pattern](https://reactjs.org/docs/forms.html)

<sub>./src/App.js</sub>
```js
//...
  
    <div className='App'>
      <input value={rapName} onChange={e=> setRapName(e.target.value)}/>
      <button onClick={done} className='done-button'> Done </button>
    </div>

//...
```

`e => setRapName(e.target.value)` - let's break it down

the `e` variable represents a `change` event fired by the `<input/>`, passed to our `=>` function

`setRapName` - our setter from `useState` we defined earlier

`e.target` represents the `<input/>` itself, and so `e.target.value` contains the new value the user is trying to set

together, we're defining a function which takes the event, and calls out setter with the correct next value (which will trigger a render!)


### card container for form input

Snoop wants his form elements to be stylish as well as functional

Let's make a card (like in [material design](https://material-ui.com/demos/cards/)) from scratch

first we'll wrap our `<input />` with a container (.card) `<div>...</div>` and nest it in a `.form` div which will hold all the form elements for our entire build (including the `<button/>` we already made)

<sub>./src/App.js</sub>
```html
//...

    <div className='App'>
      <div className='form'>
        <div className='card'>
          <input value={rapName} onChange={e=> setRapName(e.target.value)}/>
        </div>
        
        <button onClick={done} className='done-button'> Done </button>
      </div>
    </div>

//...
```

and style `.card` to be the size we want (using min-* and max-* height/width is a responsive best practice)


<sub>./src/App.scss</sub>
```scss
//...

.form {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;

  .card {
    min-width: 300px;
    min-height: 80px;

    margin: 10px;
  }
}

```


and we can add a bit of `box-shadow` to give the card a bit of pop

<sub>./src/App.scss</sub>
```scss
//...

  .card {
    width: 300px;
    min-height: 80px;

    margin: 10px;

    box-shadow:
      0px 1px 3px 0px rgba(0,0,0,0.2),
      0px 1px 1px 0px rgba(0,0,0,0.14),
      0px 2px 1px -1px rgba(0,0,0,0.12);
  }

```

we'll be reusing this `.card` container for the rest of our form elements, which is very convenient.

we should also force the `.done-button` onto its own row

```scss
//...

.done-container {
  flex-basis: 100%;
  display: flex;
  justify-content: center;

  .done-button {
    //...
  }
}

//...
```

<sub>./src/App.js</sub>
```html
//...

        <div className='done-container'>
          <button onClick={done} className='done-button'> Done </button>
        </div>


//...
```


and make it look more like our cards by giving it a `box-shadow` in its default state

<sub>./src/App.scss</sub>
```scss
//...

  .done-button {
    //...

    border: none;
    box-shadow:
      0px 1px 3px 0px rgba(0,0,0,0.2),
      0px 1px 1px 0px rgba(0,0,0,0.14),
      0px 2px 1px -1px rgba(0,0,0,0.12);
  
    //...
```

and of course, we'll need to give it back its "being pressed" state styles

```scss

   &:focus {
     //...
   }

   &:active {
     box-shadow: none;
     border: 2px inset lightgray;
   }
 
//...
```


it's the little things that make your design fly or fail. So keep your eye on the detail!




### floating label

Now we need to make it clear to the user what this `<input/>` is for!

let's add a `<label>...</label>` around it (wrapping with `<label/>` means the user clicking on the label focuses the `<input/>`)


<sub>./src/App.js</sub>
```html
//...

        <div className='card'>
          <label>
            Rap Name
            <input value={rapName} onChange={e=> setRapName(e.target.value)}/>
          </label>
        </div>

//...
```

Snoop wants it [swanky](https://material-ui.com/demos/text-fields/)


#### position: absolute;

to accomplish this, we'll need to have a [position: relative](https://www.google.com/search?q=position+relative) container `<div/>` and [position: absolute](https://www.google.com/search?q=position+absolute) children

<sub>./src/App.js</sub>
```html
//...

        <div className='card swanky-input-container'>
          <label>
            <span className='title'>Rap Name</span>
            <input value={rapName} onChange={e=> setRapName(e.target.value)}/>
          </label>
        </div>

//...
```

we'll see later why the label text moved into a `<span>`


#### flat input

we'll style the `<input/>` first, then move on to the label text

<sub>./src/App.scss</sub>
```scss
//...


```

now we can get rid of the border and set the size

<sub>./src/App.css</sub>
```css
//...

.form {
  //...
  
  .card {
    //...

    &.swanky-input-container {
      position: relative;

      input {
        position: absolute;
        border: none;
        
        bottom: 2px;
        left: 2px;
        width: 100%;
        height: 60px;

        font-size: 22px;
        padding-left: 10px;
      }
    }
  }
}
```

!!! oh no, our input is too wide... why is that?

open up the computed styles panel (right click the input -> Inspect Element... Computed panel) to review

we can see that we have 2px of position on the left, 10px of padding on the left (we put that in so our text would look good, but it adds to the total box width)

so we want our `<input />` to be 16px (2px left + 2px right + 10px padding we added + 2px from the browser) less than 100%

luckily, CSS3 added the [calc function](https://developer.mozilla.org/en-US/docs/Web/CSS/calc) for this exact case

where we had

```scss
  width: 100%;
```

we can put (be careful to put the spaces around the `-`)

```scss
  width: calc(100% - 16px);
```

now let's add an underline like in the design spec

<sub>./src/App.scss</sub>
```scss
//...

    &.swanky-input-container {
      //...

      input {
        //...
        border-bottom: 1px solid black;
        
  //...
  
```

#### :focus, transition

when the input is `:focus`ed (the user is typing in it), we want the underline to be green and that pesky outline to go away.

we'll use the [:focus pseudoselector](https://www.google.com/search?q=focus+pseudoselector) to style the input while it is `:focus`ed

<sub>./src/App.scss</sub>
```scss
//... inside the input selector

        &:focus {
            outline: none;
            font-size: 26px;
            border-bottom: 2px solid green;
        }
```

I've also increased the size of the text.

last thing, we want to apply a [css transition](https://www.w3schools.com/css/css3_transitions.asp) to the font-size

<sub>./src/App.scss</sub>
```scss
//...

    &.swanky-input-container {
      //...

      input {
        //...
        
        transition: font-size 0.25s;

        &:focus {
          //...
        }
      }
    }

//...
```

great, now we can style the label



#### absolute label

now we can position the label properly (in the top left of the container)

<sub>./src/App.scss</sub>
```scss
//...

   &.swanky-input-container {
      //...

      input {
        //...
      }

      span.title {
        position: absolute;
        top: 5px;
        left: 5px;
        cursor: pointer;
        
        font-weight: 300;
        font-size: 16px;
        z-index: 200;
      }
    }
 
```

I've also updated the `cursor` so it appears clickable to the user

and set the font how I think looks good.

`z-index` will make sure our title is drawn on top of the input


### label transitions on input:focus

now we'll see why we had to put the label text in a `<span>`

we want to change the `font-size` and `color` of the label text when the `<input/>` is `:focus`ed

the way we'll do that is by making a selector:

```
when the .swanky-input-container has the :focus-within
select its child span with className 'title'
```

which looks like

<sub>./src/App.scss</sub>
```scss
  //...
  
      span.title {
        //...
      }

      &:focus-within span.title {
        color: green;
        font-size: 12px;
      }
//...

```

remember of course that we're nested inside the `&.swanky-input-container` selector, so `&:focus-within`

[for practice with complex css selectors, play this game](https://flukeout.github.io/)


now we can put a transition on both of those styles and everything should be solid

<sub>./src/App.scss</sub>
```scss
//...

      span.title {
        //...

        transition: font-size 0.25s, color 1s;
      }

//...
```

that's pretty swanky


anyone who wants to work ahead and make another input for the album sales should do so - we'll revisit it in these notes with some more exciting features later.


### email, validation

Snoop wants to be able to contact his applicants if they throw down lots of fresh work like that input we just made.

so let's make another variable for the user's email (right after our other `useState`s)

<sub>./src/App.js</sub>
```js
  const [email, setEmail] = useState('snoop@dogg.pound');
```


and another card right after the first for input


```html
//...

        <div className='card swanky-input-container'>
          <span className='title'>Email</span>
          <input value={email} onChange={e=> setEmail(e.target.value)} />
        </div>

//...
```

bam! right away that's looking good.

Hold up a minute tho - Uncle Snoop has seen some skeezy email addresses in his day - he's gonna want us to validate.


#### controlled input validation

The controlled input pattern gives us a very straightforward way to build a validation UX.

Every time our value changes, we have our setter instance method being called... so to tell the user if their input is valid, we should compute a boolean `isEmailInvalid` variable in that same function, save it with its setter and use it to render a validation failure message

let's see what that looks like


<sub>./src/App.js</sub>
```js
//...

  const [isEmailValid, setIsEmailValid] = useState(false);

  const setValidatedEmail = e => {
    setEmail( e.target.value );
    setIsEmailValid( e.target.value.includes('@gmail.com') );
  };

  //...
```
```html
          <input value={email} onChange={setValidatedEmail} />
```


we've now just added one more variable

it starts out as `false` (if the user hasn't entered anything, the email van't be invalid yet)

then as soon as the user types, we check whether each new value contains the string `@gmail.com` to determine if it is a valid email

if you use hotmail still, it just won't work!

our `onChange` handler for our `email` input now sets two variables!


#### rendering from validation state

if the email is inValid, we want to render out an extra `<span>` with our validation message


```html
//...

        <div className='card swanky-input-container'>
          <span className='title'>Email</span>
          <input value={email} onChange={setValidatedEmail} />
          
          {isEmailValid ? null : (
            <span className="invalid">Please enter a valid email address</span>
          )}
        </div>

//...
```

so far so good, now we can style it to fit in the top right corner of our card


<sub>./src/App.scss</sub>
```scss
//... inside the .swanky-input-container 

     span.invalid {
        position: absolute;
        top: 5px;
        right: 5px;

        font-size: 12px;
        color: red;
        text-align: right;
      }
 

```

that's great and all, but maybe it shouldn't show up while we're typing!

let's use the same trick as last time to `display: none;` the invalidation message while the `input` is `:focus` (and its container therefore has `:focus-within`)

and the [:not() pseudoselector](https://developer.mozilla.org/en-US/docs/Web/CSS/:not) to style it otherwise

<sub>./src/App.scss</sub>
```scss
//... inside the .swanky-input-container

      &:focus-within span.invalid {
        display: none;
      }

      &:not(:focus-within) span.invalid {
        position: absolute;
        top: 5px;
        right: 5px;

        font-size: 12px;
        color: red;
        text-align: right;
      }
```

Fresh!


### email validation regex

Our "gmail only" rule is a bit harsh! Snoop wants us to use the RFC 5322 Official Standard [email regex](https://emailregex.com/) validator to mellow out the vibe.

To accomplish this goal, we'll need to learn how to [check a string with a regex in javascript](https://www.google.com/search?q=check+string+regex+js)

now that we've done that, let's plop that regex down into a utility file, export it, import it to App.js and use it for our check


`$ touch ./src/emailRegex.js`

<sub>./src/emailRegex.js</sub>
```js
// eslint-disable-next-line
export default /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
```

which will of course make our default email address `snoop@dogg.pound` valid

<sub>./src/App.js</sub>
```js
//... the other import statements

import emailRegex from './emailRegex';

  //...
  const [isEmailValid, setIsEmailValid] = useState(true);
  
  const setValidatedEmail = e => {
    setEmail( e.target.value );
    setIsEmailValid( emailRegex.test( e.target.value ) );
  };

  
  //...

```

that's way smoother now.


### albums sales, number format

Aight. Snoop's gonna need to know how many albums you've been slangin

like before, we'll need to connect our setter to our input, along with the divs and other markup


<sub>./src/App.js</sub>
```html
//...

        <div className='card swanky-input-container'>
          <label>
            <span className='title'>Album Sales</span>
            <input value={albumSales}
                   type='number'
                   step={1000}
                   onChange={e=> setAlbumSales(Number(e.target.value))} />
          </label>
        </div>

```

here, I've set `type='number'` and `step={1000}` to take advantage of the built in HTML number input behaviour.

also our `onChange` handler will cast the `e.target.value` to `Number`, because `<input/>`s always send us strings


### gold and platinum albums

Snoop is very impressed with your number input, he just isn't connecting to it. He wants us to display gold records on top of the input for every million albums sold (up to four).

[he's taken a picture of one of his gold records and had a designer make a .png with a transparent background for us to download](https://github.com/nikfrank/react-course-workbook-2/blob/step7/src/goldRecord.png?raw=true) into our <sub>./src</sub> directory


first, let's render out all four albums, then we can filter that down

<sub>./src/App.js</sub>
```js
//... other imports

import goldRecord from './goldRecord.png';

//...
```

```html
        <div className='card swanky-input-container'>
          <label>
            <span className='title'>Album Sales</span>
            <input value={albumSales}
                   type='number'
                   step={1000}
                   onChange={e=> setAlbumSales(Number(e.target.value))} />
          </label>
          <div className='goldRecords'>
            {
              [1,2,3,4]
                .map(n => (
                  <div className='goldRecord' key={n} >
                    <img src={goldRecord} alt='solid gold'/>
                  </div>
                ))
            }
          </div>
        </div>
```

we'll use the outer `<div>` as a flex container (going right to left) starting from 50px from the right side of the swanky-input-container

let's put these styles nested inside `.card`, as that is the div it'll be positioned relative to

<sub>./src/App.scss</sub>
```scss
//...

  .card {
    //...

    .goldRecords {
      position: absolute;
      right: 50px;
      height: 100%;
      
      display: flex;
      flex-direction: row-reverse;
      align-items: center;
    }
  }

```

and we'll use the extra `<div>` wrapping the `<img/>` to make the records overlap

```scss
//...

    .goldRecords {
      //...

      .goldRecord {
        width: 20px;
        z-index: 20;
      }

      .goldRecord img {
        width: 50px;
        height: 50px;
      }
    }

//...
```

now let's use our skills with [Array.filter](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter) to show the right number of records

<sub>./src/App.js</sub>
```html

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

```

solid!

We're using a common pattern in React here of computing multiple things from one reactive variable

if the computation is more complex (sorting, arithmetic, etc), we would consider not doing it inside the render function, as that would slow down our app, like we did with the email validation.

---

[back to the top](#thatop)

---

<a name="step3"></a>
## step 3: break'm off somethin - drop downs

Snoop is going to want to know more than a name and a number!

<img src='http://hiphopgoldenage.com/wp-content/uploads/2015/07/42-27797293.jpg' height=250 width=325/>

He also has a list of open positions to apply to, and is going to want to know where you're from (country / state)

first let's initialize some varaibles with `useState` for the user to fill in

<sub>./src/App.js</sub>
```js
//...

  const [job, setJob] = useState('');
  const [country, setCountry] = useState('');
  const [topAlbum, setTopAlbum] = useState(null);

//...
```


### picking a job

<sub>./src/App.js</sub>
```html
          <div className="card swanky-input-container">
            <label>
              <select onChange={e=> setJob(e.target.value)} value={job}>
                <option value=''>Select Job</option>
                <option value='rapper'>rapper</option>
                <option value='sales'>sales</option>
                <option value='distribution'>distribution</option>
              </select>
              <span className='title'>Job</span>
            </label>
          </div>

```

here we'll also want to add selectors for the select, and to fix the `font-size` for the `<option>` tags (to reduce jank)

<sub>./src/App.scss</sub>
```scss
//... .swanky-input-container
      
      input, select {
        //... our other input styles

        background-color: white;

        option {
          font-size: 22px;
        }
      }
```

### dropdown with an image (album selection)

Snoop is all about the music. So when someone applies for a job with him, he's going to want to know that person's favourite rap album

We could make "just another dropdown", but we'd rather really impress Snoop by making a dropdown that also shows the album cover `<img/>`!

unfortunately, when we try to render an `<img/>` into an `<option/>` we get an error `Only strings and numbers are supported as <option> children.`

So we're going to have to build the entire dropdown from scratch using `<div/>`s

#### downloading assets

first, let's decide on a list to choose from

|name|year|cover|
|---|---|---|
|Doggystyle|1993|<img src="https://upload.wikimedia.org/wikipedia/en/6/63/SnoopDoggyDoggDoggystyle.jpg" height=200 width=200/>|
|Tha Doggfather|1996|<img src="https://upload.wikimedia.org/wikipedia/en/a/a3/Tha-doggfather.jpg" height=200 width=200/>|
|Da Game Is to Be Sold, Not to Be Told|1998|<img src="https://upload.wikimedia.org/wikipedia/en/c/c5/Gameistobesold.jpg" height=200 width=200/>|
|No Limit Top Dogg|1999|<img src="https://upload.wikimedia.org/wikipedia/en/d/d1/Snoop_front.JPG" height=200 width=200/>|
|Tha Last Meal|2000|<img src="https://upload.wikimedia.org/wikipedia/en/d/dc/The_Last_Meal_-_Front.jpeg" height=200 width=200/>|

Obviously everything Snoop puts out is fresh, so we can always add more later.

You can go ahead and grab the album cover image source urls from here, or get some other fire picks from the open web


#### importing assets

let's make an index file for all the albums to keep things organized

`$ touch ./src/snoopAlbums.js`

<sub>./src/snoopAlbums.js</sub>
```js
export default [
  { name: 'Doggystyle', year: 1993, cover: 'https://upload.wikimedia.org/wikipedia/en/6/63/SnoopDoggyDoggDoggystyle.jpg' },
];
```

we `export` an array of albums, each of which is an object

each album's object will need a field for `name` string, `year` number, and `cover` image url string

(I'll leave it as an exercise to follow this pattern and complete the list of albums)


#### rendering the selection


let's render out the two possible closed states (no selection made, selection already made)

<sub>./src/App.js</sub>
```js
import snoopAlbums from './snoopAlbums';
```

```html
//...

        <div className='card swanky-input-container'>
          <span className='title'>Top Album</span>
          <div className='album-dropdown-base'>
            {!topAlbum ? (
              <span>Select Top Album</span>
            ):(
              <>
                <img src={topAlbum.cover} alt={topAlbum.name}/>
                <span>{topAlbum.year}</span>
                <span>{topAlbum.name}</span>
              </>
            )}
            <span className='drop-arrow'>▼</span>
          </div>
        </div>

//...
```

again, we can nest these rules inside `.card`

<sub>./src/App.scss</sub>
```scss
//...

    .album-dropdown-base {
      display: flex;
      align-items: center;
      justify-content: space-between;
      cursor: pointer;

      padding: 30px 25px 10px 10px;
      max-width: 300px;
      
      img {
        height: 45px;
        margin-top: -5px;
        width: 45px;
      }

      .drop-arrow {
        position: absolute;
        right: 5px;
        user-select: none;
      }
    }

```

now if we set the initial value of `topAlbum` to `snoopAlbums[0]` in our `useState` declaration, we'll see doggystyle render out


#### toggling the dropdown open state

now that the closed states render correctly, we need to give our dropdown the ability to open

<sub>./src/App.js</sub>
```js
  const [topAlbumOpen, setTopAlbumOpen] = useState(false);

  const toggleTopAlbumOpen = ()=> setTopAlbumOpen(open => !open);

  //...
```
```html
          <div className='album-dropdown-base' onClick={toggleTopAlbumOpen}>
```

now that we can toggle the state, we have three things to remember

1. switch the drop arrow to point up
2. render the selectable items
3. render an invisible "click out" div behind the selectable items, so when the user clicks out, we can close the dropdown
4. we can't see the variables! until we render anything based on it, a variable is worthless (though we can `console.log` it!)



#### switch the drop arrow to point up

```html
  <span className='drop-arrow'>{topAlbumOpen ? '▲' : '▼'}</span>
```

that was easy!



#### the selectable items

we're going to render a `<ul>` when the `topAlbumOpen` is `true`

<sub>./src/App.js</sub>
```html
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
            <ul className='selectable-albums'>
            </ul>
          )}
        </div>
```

and in it, we'll render a list of the albums

```html
            <ul className='selectable-albums'>
              {snoopAlbums.map(({ name, year, cover })=> (
                <li key={name} onClick={()=> selectTopAlbum({ name, year, cover })}>
                  <img src={cover} alt={name}/>
                  <span>{year}</span>
                  <span>{name}</span>
                </li>
              ))}
            </ul>
```

and of course a `selectTopAlbum` function which also closes the dropdown

```js
  const selectTopAlbum = album => {
    setTopAlbum(album);
    setTopAlbumOpen(false);
  };
```


now let's style it to work

first we'll put some basic styles on the `<ul/>` (which is inside `.card`)

<sub>./src/App.scss</sub>
```scss
ul.selectable-albums {
  list-style: none;
  padding: 0;
```

and position it just below the `.album-dropdown-base`

```scss
  position: absolute;
  top: 100%;
  width: 100%;
```

then we can limit its height and make it scrollable

```scss
  max-height: 25vh;
  overflow-y: auto;
```

finally we can add a box-shadow to match the decor and a z-index to render it correctly

```scss
  margin: 2px 0 0 0;

  z-index: 30;

  background-color: white;
  box-shadow:
    0px 1px 3px 0px rgba(0,0,0,0.2),
    0px 1px 1px 0px rgba(0,0,0,0.14),
    0px 2px 1px -1px rgba(0,0,0,0.12);
  
}
```


now that we have the `<ul/>` styled, we can style the `<li/>` tags within it


<sub>./src/App.scss</sub>
```scss
      li {
        display: flex;
        align-items: center;
        justify-content: space-between;
        cursor: pointer;
        padding: 10px 0 10px 10px;
        position: relative;
        z-index: 30;
        background-color: white;


        img {
          height: 45px;
          margin-top: -5px;
          width: 45px;
        }
      }
```

now we can set a hover state on the items to make them more user-interactive (inside the `li` selector)


```scss
        &:hover {
          background-color: #eee;
        }
```

and we can limit the size and set text overflow to `ellipsis` (aka to cut off the overflow text with a '...')

```scss
        span {
          display: inline-block;
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow: hidden;

          &:first-of-type {
            width: 45px;
          }
          &:nth-last-of-type(2){
            width: 140px;
          }
        }

```

that looks pretty good for 25 lines of SCSS - Snoop would be impressed by our mix of pithy brevity with meaningful levity

styling the spans in the `.album-dropdown-base` is left as an exercise, the selectors and rules we just learned should show you the way


#### the click out

finally, the user instinctually will expect that clicking outside of the drop down will close the dropdown and gobble up the click event (not trigger `onClick` for whatever outside the dropdown they clicked)

to accomplish this, we'll render a `<div/>` underneath the dropdown `<ul/>` but above everything else

then it will take the click event for "click-out" and we can trigger a function from its `onClick`

<sub>./src/App.js</sub>
```html
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
```

here we're using the empty tag syntax for `React.Fragment` ie `<> ... </>`, which is a fake element which just wraps a bunch of tags so that there's technically one root element returned from an expression (here we need it because of the conditional ternary operator is an expression, which means it can only evaluate to one root element)


we'll need to style the clickout div to capture the clicks when they aren't on the dropdown list items

<sub>./src/App.scss</sub>
```scss
//... inside the .album-dropdown-base

      & + .click-out {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
      }
```

here, we're using the next sibling selector (you knew that though... you blasted through the css selector game already)


#### bonus: styling the scrollbar

Snoop is probably going to think that scrollbar looks a bit 1992, and not in the good way.

Let's be proactive and funk it up

[styling scrollbars is fairly new in CSS, so I find CSS tricks to be a great resource for this kind of thing](https://css-tricks.com/almanac/properties/s/scrollbar/)

```scss
//... inside the ul.selectable-albums selector

      &::-webkit-scrollbar {
        width: 5px;
      }

      &::-webkit-scrollbar-track {
        background-color: #0000;
      }

      &::-webkit-scrollbar-thumb {
        background-color: #7d79;
        border-radius: 2.5px;
      }


```

### menu hover dropdown -> header

Our app has no bite... just a bunch of form elements. Snoop wants to put a header at the top of the page that lets us set our favourite g-funk rapper to appear

So what we'll make is a navbar with `position: fixed`, an `<img/>` in the middle (whose `src` prop we render from `state`) and a hover-dropdown menu to select the rapper


#### importing assets

we can use the index-file pattern again to keep our data separate from our view

`$ touch ./src/rappers.js`

<sub>./src/rappers.js</sub>
```js
export default [
  { name: 'Snoop Dogg', imgSrc: 'http://i.imgur.com/8wjnDvw.png' },
  { name: 'Tupac Shakur', imgSrc: 'https://timpviewnews.org/wp-content/uploads/2019/09/xzz8rezYcE8usc8V33ZAYTNOtWK0vCN5eEIhkCf2.png' },
  { name: 'Dr Dre', imgSrc: 'https://i.imgur.com/QYo0aPI.png' },
  { name: 'Eminem', imgSrc: 'http://4.bp.blogspot.com/_wevkEt-i9rw/R0YBWvL9WuI/AAAAAAAAABs/G6TjBC3BuXY/s320/eminem-5.png' },
];
```


#### fixy navbar

we've seen so far `position: relative` and `position: absolute` for declaring reference frame elements (relative) and positioning children elements based on them (absolute)

now we get to use the other common value ... `position: fixed` ... which is the same as `absolute` except that it always uses the window as the reference frame.

<sub>./src/App.js</sub>
```html
  <div className='App'>
    <div className='header'></div>
    //...
```

<sub>./src/App.scss</sub>
```scss
.header {
  position: fixed;
  height: 100px;
  top: 0;
  left: 0;
  right: 0;
  border-bottom: 2px solid black;
  background-color: #3338;
  color: white;
}

.form {
  padding-top: 120px;
  //...
  
```

we've also added some padding to the form so it doesn't get hidden under the `.header`

the reason it'd get hidden under there is that `position: fixed` (like `position: absolute`) takes elements OUT OF THE DOCUMENT FLOW

what does that mean?

the DOCUMENT FLOW is the order (top left to bottom right) that elements render in normal HTML. `display: block` or `display: flex` elements go top to bottom, `display: inline` or `display: inline-block` or `display: inline-flex` go from left to right. Normally when you render something like:

```html
<div>blah</div>
<p>hmm</p>
```

`div` and `p` are both `display: block` by default, so `blah` renders above `hmm`

if we'd styled the `div` to be `position: fixed` at the top of the window, they would render on top of eachother because the `div` no longer pushes the `p` down the page (because it can only do that if it's IN FLOW)

generally, we want to keep elements IN FLOW - we make exceptions in two cases:

1. things that really actually need to stay in a fixed position on the screen (such as navbars or static footers)
2. lowly elements positioned absolutely inside a meaningful container (as we saw with the `swanky-input-container`, which itself is still IN FLOW)


#### rendering the image

we're going to need to import the `rappers` array (along with whatever we were `import`ing before)

<sub>./src/App.js</sub>
```js
import { useState } from 'react';
import './App.scss';

import emailRegex from './emailRegex';
import goldRecord from './goldRecord.png';

import snoopAlbums from './snoopAlbums';
import rappers from './rappers';

const App = ()=> {
  //...
```

now we can make a state variable to track the `topRapper`

```js
  //...

  const [topRapper, setTopRapper] = useState(rappers[0]);

  //...
```

and render an image from the `topRapper.imgSrc`

```html
  <div className='header'>
    <img src={topRapper.imgSrc} alt={topRapper.name} />
  </div>
```

and style it to not look all stretched out

<sub>./src/App.scss</sub>
```scss
.header {
  //...

  display: flex;
  justify-content: center;

  img {
    width: auto;
    height: 100%;
  }
}

//...
```


#### hover dropdown selection

this is a great solution where we get to use pure CSS + HTML to accomplish a behavioural feature

we're going to make a `<ul/>` in our `.header` which is normally tucked away, but opens up when we `:hover` it

then it will only go away once we move our mouse off the (newly enlargened) `<ul/>`

(credit for teaching me this to Julien)

```html
        <div className='header'>
          <img src={topRapper.imgSrc} alt={topRapper.name}/>
          <ul className='hover-dropdown'>
            <li key='top item'>{topRapper.name}</li>
            {rappers.map(rapper=>(
              <li key={rapper.name} onClick={()=> setTopRapper(rapper)}>{rapper.name}</li>
            ))}
          </ul>
        </div>
```


so far we have the currently selected rapper at the top slot, and then all the options in a list

now the funky CSS

<sub>./src/App.scss</sub>
```scss
//...

ul.hover-dropdown {
  list-style: none;
  padding: 0;
  
  position: absolute;
  right: 10px;
  top: 20px;

  height: 30px;
  overflow: hidden;

  &:hover {
    height: initial;
    z-index: 50;
  }

  li {
    height: 30px;
    font-size: 24px;
    padding: 3px 10px;
  
    background-color: #000c;
  }
}

//...
```

`height: initial` is telling CSS to ignore the `height: 30px;` we had set otherwise (`initial` is like saying "whatever you were going to do anyways"... or "as you were, carry on" if you're British)

`height: 30px` on the `<ul/>` and `height: 30px` on the `<li/>` meant that we would only see the first `<li/>` then with `overflow: hidden`, the rest got cut off!


so once the user `:hover`s, we clear the height restriction and `z-index: 30` to make sure the `<ul/>` renders on top of whatever form items there are lower on the page.


#### styling the menu

the sublime slickness of our hover dropdown bidness is being hampered by it not looking slick at all!

let's round the corners and put in a separator for the list items

<sub>./src/App.scss</sub>
```scss
//...

ul.hover-dropdown {
  //...

  border-radius: 5px;

  //...

  li {
    //...

    cursor: pointer;
    user-select: none;

    &:first-child {
      cursor: default;
      background-color: #0003;
      text-align: center;
    }

    &:not(:first-child):not(:last-child) {
      border-bottom: 1px dashed #8888;
    }
  }
}

//...
```

that `:not(:first-child):not(:last-child)` is pretty ugly...

[if we check our handy list of CSS pseudoselectors](https://developer.mozilla.org/en-US/docs/Web/CSS/Pseudo-classes), it would appear there's no better option for selecting the non-endcap items in a list. So be it - cash don't grow on trees, so we need to do tha deed



#### mobile styling

on mobile devices, `:hover` is mocked by the browser when the user presses the `<ul/>`! It wasn't always that way in the old school.

however, the top list item is sometimes rendering on top of our rapper image, so let's put a `z-index: 25` on the `<img/>` so when the menu is tucked away it goes underneath Snoop (or pac or whomever)

<sub>./src/App.scss</sub>
```scss
//...

.header
  //...

  z-index: 50;

  img {
    //...

    z-index: 25;
  }
}
//...
```

In the real world (tm), we'll probably be using this pattern to make a navigation menu, not some frivolous `<img/>` selector.

So we'll have to remember it so we can use it in the next workshop!



### autocomplete / filter dropdown (country)

Anyone who is anyone uses google (probably to answer most of the questions you've had working through this workshop), and google has autocomplete

so Snoop figures he needs some autocomplete, and frankly - can you blame him? autocomplete is pretty fly.

To make this, we'll duplicate all of our markup from the `<input/>`s we made before, plus we'll add the dropdown pattern we used in the album selector.

One new thing we'll learn here is how to `.filter` the list items on the fly - based on what the user has typed already.


#### list of countries

The data we'll autocomplete will be the country of origin.

For source data, we can find a nice JSON list [here](https://gist.github.com/Keeguon/2310008)

if you have some political opinions about some of the response items from this query (eg my dad says Canada is really just part of USA and shouldn't be on the list), feel free to edit the output as you see fit after downloading the resultant JSON file.

Snoop doesn't really care - he just wants his autocomplete to work and his fans (wherever they are from) to have a good time using it - so in the name of laziness and good vibes, I won't be editing the output at all, even though doing so contravenes my father's views on Canadian sovereignty.



#### formatting the data

the JSON from the gist comes as

```js
[
  { name: 'the actual name that we want to use', code: 'some two letter code we don\'t care about' },
  //...
]
```

in order to get the format we want (just the names), I've copy-pasted the output into the browser console (shift + control + i) to run a cleanup script

```js
const output = [{ /* entire output from JSON file */ }];
```

to print out the data that we'll want for the file, we can do


```js
JSON.stringify(output.map(i => i.name)).replace(/",/g, '",\n')
```

then copy pasted the result (without the containing "double quotes") into my file (also I needed to escape a few single quotes)

how does it work?

first we `.map` out the field from each object that we want (into an array of country `name`s)

then we put line breaks in using `.replace`

all the end of item sequence `",`s (using the regex `/",/g` with a g = global flag... ie `.replaceAll`) with `'",\n'` ie a double quote comma and a newline character.

[replace is a very useful String.prototype function, and a great excuse to up your regex skills](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace)


now that we did that, we can

`$ touch ./src/countries.js`

and export that output list

<sub>./src/countries.js</sub>
```js
export default [
  'Canada',
  'Japan',
  //... etc ...
];
```

#### making another input


<sub>./src/App.js</sub>
```js
  //...

  const [country, setCountry] = useState('');
  const [countryQuery, setCountryQuery] = useState('');
  const [selectableCountries, setSelectableCountries] = useState([]);

  //...
```

```html
//...

          <div className="card swanky-input-container">
            <div className="country-dropdown-base">
              <input value={countryQuery} onChange={e=> queryCountries(e.target.value)}/>

              <span className='title'>Country</span>

              {selectableCountries.length ? (
                 <ul className='selectable-countries'>
                   {selectableCountries.map(countryName=> (
                     <li key={countryName} onClick={()=> selectCountry(countryName)}>
                       {countryName}
                     </li>
                   ))}
                 </ul>
              ): null}
            </div>
          </div>
//...
```


#### making the country dropdown work

we'll need to write definitions for the functions we already used in our JSX `queryCountries` and `selectCountry`

when we query the countries, we need to calculate the list of countries to show

and when we select one, we need to empty that list

<sub>./src/App.js</sub>
```js
//...
import countries from './countries';

  //...

  const selectCountry = (countryName)=>{
    setCountry(countryName);
    setCountryQuery(countryName);
    setSelectableCountries([]);
  };

  const queryCountries = (query)=>{
    setCountryQuery(query);
    setSelectableCountries( countries.slice(0, 3) );
  };

  //...
```

when we select a country (the user clicked an option), we want to set `country` - the actual value AND `countryQuery` - the value the user sees to the result

for now, typing the the input will always show the first three countries, we'll get that sorted out once we do our styling


<sub>./src/App.scss</sub>
```scss
//...


.country-dropdown-base {
  position: relative;
  height: 100%;
}

.country-dropdown-base input {
  background-color: #0000;
}


ul.selectable-countries {
  list-style: none;
  padding: 0;

  position: absolute;
  top: 100%;
  width: 100%;

  max-height: 25vh;
  overflow-y: auto;
  
  margin: 2px 0 0 0;

  z-index: 30;

  background-color: white;
  box-shadow:
    0px 1px 3px 0px rgba(0,0,0,0.2),
    0px 1px 1px 0px rgba(0,0,0,0.14),
    0px 2px 1px -1px rgba(0,0,0,0.12);
  

  li {
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
    padding: 10px;

    &:hover {
      background-color: #eee;
    }
  }
}

```

that's pretty straightforward eh?

now we need the autocomplete to do something worthwhile



#### filtering and sorting on the fly

if there's an exact match, we should set that into `country`

meanwhile

to generate an autocomplete list

we want to sort by best match (match string contains case insensitive)

we need to score each country by how close a match it is to our current text

then sort by the score

then map back to just the name of the country

then take just the top three

```js
  //...

  const queryCountries = (query)=>{
    setCountryQuery(query);

    const foundCountry = countries.find(
      countryName => countryName.toLowerCase() === query.toLowerCase()
    );

    if( foundCountry ) selectCountry(foundCountry);
    else
      setSelectableCountries(
        countries
          .map(countryName => [countryName, score(query, countryName)])
          .sort((ca, cb)=> cb[1] - ca[1])
          .map(c=> c[0])
          .slice(0,3)
      );
  };

```

but there's a bug! `score` is undefined, which is not a function!

so let's write a `score` function, which takes `(query, option)=>` our current query text and each option for matching, and returns a number which says how good a match they are

Here, there's a million ways to do this (one time I programmed a text matching algorithm based on the scrabble values of the letters matched) - here I'll show you the simplest one I thought of

```
start the score at 0
first, check if the entire query is included in the option -> if it is add (query.length) to the score
for every number N less than the length of the query, take the first N characters of the query
 -> check if those are included in the option -> if they are add (N) to the score
subtract the length of the option (or 10, whichever is less ... we don't want to punish long names too much)
```

The score will be maximized if the entire query is found and there are no other characters

let's see that in js

```js
const score = (query='', option)=>
  query.split('').reduce((p, c, i)=>
    p + (option.toLowerCase().includes( query.slice(0, query.length -i).toLowerCase() ) ?
         query.length - i : 0
    ), -Math.min(10, option.length));
```

I've accomplished the step of `start at 0` and `subtract the length or 10` by starting at `-length, or -10` (in the `.reduce`'s initial value param)

`query.split('')` will give us an Array of the right length which we can loop over (one for each character)

`.reduce((p, c, i)=>` is a reduce function (p = previous value, c = current item, i = index)

here, the current items are the character which we won't really use, so all we care about is p = the running total and i the index we're looking at

`p + (...)` we return the previous running total plus whatever value we compute for this index

`option.toLowerCase().includes( ... ) ? query.length - i : 0` if the option contains (... the part of the query ...) evaluate the length of the part of the query (to be added to the running total), otherwise 0 (don't change the running total)

`query.slice(0, query.length -i).toLowerCase()` take the first N letters of the query (`i` counts up from `0`, so `query.length -i` will count down from the length of the query) to be compared to

`, -Math.min(10, option.length)` start the reduce's running total (`p`'s init value) at `-length` or `-10` whichever is closer to `0`

both strings are forced into lower case in order to ignore case differences between the query and the option


#### click out, re-query

we need a click out here

and, if the user clicks back into the input, we want to show the dropdown


```html
        <div className="card swanky-input-container">
          <div className="country-dropdown-base">
            <input
              value={countryQuery}
              onChange={e=> queryCountries(e.target.value)}
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
```

we can reuse `this.clickOut` from before, we'll need to reset a few more `state` values therein now

<sub>./src/App.scss</sub>
```scss
//...

ul.selectable-countries {
  //...

  & + .click-out {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }
}

```


(( author NB, updated til here ))




### picking a date

Snoop wants to know when you can start working!

To make our life easy, we're not going to build a datepicker from scratch - that'd be reinventing the wheel!

Instead, we're going to use [Hacker0x01's popular react-datepicker module](https://github.com/Hacker0x01/react-datepicker)

`$ npm install -S react-datepicker`

or

`$ yarn add react-datepicker`

the react-datepicker docs should give you all you need to pick a date and put it in the state!


the team that wrote react-datepicker made their `<DatePicker/>` Component using the same controlled input pattern, which should make it very easy to use

just remember to put it in a `<div className='card'>...</div>`


<details>
<summary>Click here to view solution for this section</summary>

```html

          <div className='card date-input-container swanky-input-container'>
            <DatePicker selected={this.state.startDate} onChange={this.setStartDate}/>
            <span className='title'>Start Date</span>
          </div>
```

```js
  setStartDate = startDate => this.setState({ startDate })
```

</details>


#### shimming the CSS

now that we got our `<DatePicker/>` working, we need to fix a few CSS bugs

1. the popper renders underneath some other form components
2. the `<input/>` doesn't take up the right space in the `.card`
3. our `span.title` isn't highlighting correctly on `:focus`

how are we going to figure out how to fix CSS in someone else's code?

Snoop famously says "gangsters use the dev tools"... so let's inspect the elements (right click them) in the dev tools and figure out why the bugs are happening

1. the popper has a z-index problem

when we click the little `<input/>` to get the date-picker-popper, we can see in the HTML elements panel (by selecting the correct div and inspecting its CSS rules) that some part of the datepicker.css is giving it `z-index: 1`

now we can test if changing that would work (we can edit the CSS live in the browser)

so if we can just get `z-index: 40` onto that `<div/>`, everything will be fine

<sub>./src/App.css</sub>
```css
.react-datepicker-popper {
  z-index: 40;
}
```

... hmm, that didn't work... why?

if we go to inspect the element again, we see that our `z-index: 40` rule is lower on the list than the `z-index: 1` rule and is being overridden!

the reason for this is the C in CSS (cascading, as in: rules that are written later override previous rules)

as it turns out, the compiler is putting our CSS before the lib CSS, so their's overrides ours!

how can we override their's?

good question: the answer is [CSS specificity](https://www.google.com/search?q=css+specificity)

all we have to do is make a MORE SPECIFIC rule, and CSS will apply ours over their's!

```css
.card .react-datepicker-popper {
  z-index: 40;
}
```

it turns out, 2 classNames is more specific than 1 (who would've guessed that)

so la di da di, we likes to party, we override your CSS, we don't bother nobody.



2. the `<input/>` sizing

when we sized our `<input/>`s before, we relied on the `.card` being the relative reference frame element.

however, when we inspect the current state of affairs, we see that the `react-datepicker` library is putting its own `relative` div inbetween ours and the `<input/>`

hmm...

there's not much of a clean solution to this.

In general, I'd rather keep to the relative sizing styles we've been using so far

that said, in this one instance we can hard code some pixel sizes on the input

```css
.date-input-container input {
  height: 60px;
  width: 286px;
  top: 0;
}
```

not elegant, but it'll do.


3. the title isn't highlighting

this is due to our rule being `input:focus + span.title`

which relied on the `<input/>` and `<span/>` being adjacent siblings

now when we inspect the datepicker, we see that the `<input/>` is nested inside some `<div/>`s, and is therefore no longer an adjacent sibling

so we'll need a new solution... we can use `:focus-within` pseudoselector, which is a bit less specific, but works nicely

```css
.date-input-container:focus-within span.title {
  color: green;
  font-size: 12px;
}
```

Snoop says: Gangsters use the dev tools

sometimes when we deal with third party CSS, we'll end up with bugs caused by unforseen code interactions

in those instances (also when we cause the bugs ourselves) the inspect elements panel is extremely powerful

it tells us what HTML elements we have and how they're structured, AND all the CSS that applies to them and in which order

AND it let's us edit the CSS live to try out solutions we think of.

As soon as I started using these features to their maximum, my CSS skillz EXPLODED.

---

[back to the top](#thatop)

---

the rest of this workshop is targeting the senior dev track.

<a name="step4"></a>
## step 4: and it's gotta be bumpin - refactor to components

### rapper images, menu dropdown
### floating label input
### image dropdown
### autocomplete dropdown
### SCSS
### destructuring this.state in render


<a name="step5"></a>
## city of compton - notifications and animations

### toastr on submit
### transition on cards entry
### transition on floating labels
### transition on validation colors
### transition on dropdowns
### tupac ak-47!!!!



This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).
