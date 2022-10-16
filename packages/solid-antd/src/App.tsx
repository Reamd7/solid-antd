import { Component, createSignal } from 'solid-js';
import InternalButton from './components/button/button';


const App: Component = () => {
  const [buttonContent , setButtonContent] = createSignal("111")
  return (
    <div>
      {buttonContent()}

      <InternalButton htmlType="submit" className={"e"} onClick={(e) => {
        // console.log(e.currentTarget.innerText)
        setButtonContent(new Date().toISOString())
      }}>
        {buttonContent()}
      </InternalButton>
    </div>
  );
};

export default App;
