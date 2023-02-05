# How to make an ErrorBundary Component in React

## What is an ErrorBoundary Component?

An ErrorBoundary Component is a component that catches errors in the React component tree, logs those errors, and displays a fallback UI instead of the component tree that crashed. Error boundaries catch errors during rendering, in lifecycle methods, and in constructors of the whole tree below them.

## How to make an ErrorBoundary Component?

### 1. Create a new file in your project
### 2. Import React and Component from react 
### 3. Create a class component that extends Component
### 4. Create a constructor that takes in props
### 5. Call super(props)
### 6. Create a state object with a hasError property set to false
### 7. Create a componentDidCatch method that takes in error and info
### 8. Set the hasError property in state to true
### 9. Create a render method
### 10. If the hasError property in state is true, return a div with some text
### 11. Else, return this.props.children

## How to use an ErrorBoundary Component?

### 1. Import the ErrorBoundary Component
### 2. Wrap the component that you want to catch errors in the ErrorBoundary Component

## Example

### ErrorBoundary.js

    import React, { Component } from 'react';

    class ErrorBoundary extends Component {
      constructor(props) {
        super(props);
        this.state = { hasError: false };
      }

      componentDidCatch(error, info) {
        this.setState({ hasError: true });
      }

      render() {
        if (this.state.hasError) {
          return <div>Something went wrong.</div>;
        }
        return this.props.children;
      }
    }

    export default ErrorBoundary;

### App.js
   
      import React, { Component } from 'react';
      import ErrorBoundary from './ErrorBoundary';
   
      class App extends Component {
         render() {
         return (
            <ErrorBoundary>
               <div>
               <h1>My App</h1>
               <p>Some text</p>
               </div>
            </ErrorBoundary>
         );
         }
      }
   
      export default App;
      