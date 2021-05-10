import React from 'react'
import classes from './Burger.module.css';
import Aux from '../../hoc/Aux';
import BurgerIngredient from './BurgerIngredient/BurgerIngredient';
import { withRouter } from 'react-router-dom';

const burger = (props) => {
  
    let transformedIngredients = null;

    transformedIngredients = Object.keys(props.ingredients).map(igKey => { 
        return [...Array(props.ingredients[igKey])].map((_, i) => {
           return <BurgerIngredient key={igKey + i} type={igKey} />
        });
    });  
    
    if(transformedIngredients.length === 0){
        transformedIngredients = <p>Please start adding ingredients</p>
    }
   
    return (
        <Aux>
        <div className={classes.Burger}>
            <BurgerIngredient type='bread-top' />
            {transformedIngredients}
            <BurgerIngredient type='bread-bottom' />
        </div>
        </Aux>
    )
}

  export default withRouter(burger);