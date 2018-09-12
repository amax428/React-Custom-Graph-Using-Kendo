import React from 'react';
import ReactDOM from 'react-dom';
import { Surface } from '@progress/kendo-drawing';
import { Popup } from '@progress/kendo-react-popup';
import { drawScene } from './draw-scene';
import './background.scss';



class App extends React.Component {

    constructor(props) {
        super(props);

        this._element = null;
        this.state = {
            width: 1000,
            height: 265
        };
    }
    componentDidMount() {
        // Draw the scene after the components has been rendered
        drawScene(this.createSurface(), this.state.width, this.state.height);
    }
    componentWillUnmount() {
        // Destroy the surface before the component will unmount
        this._surface.destroy();
    }

    createSurface() {
        // Create a drawing surface
        this._surface = Surface.create(this._element);

         return this._surface;
    }

    
    render() {
        return (
            <div className = "container">
                <div className="example-wrapper">
                    <div className = "chart_area" ref={(div) => { this._element = div; }} />
                </div >
            </div>
        );
    }
}

export default App;