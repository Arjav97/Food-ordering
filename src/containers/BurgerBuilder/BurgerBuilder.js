import React, { Component } from 'react';
import Aux from '../../hoc/Aux';
import Burger from '../../components/Burger/Burger.js';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/WithErrorHandler/WithErrorHandler';
import { connect } from 'react-redux';
import * as actions from '../../store/actions/index';
import axios from '../../axios-orders';

class BurgerBuilder extends Component{
    
    state={ 
        purchasing:false
    }

    componentDidMount() {
       this.props.onInitIngredients()
   }

    updatePurchaseState (ingredients) {
        
        const sum = Object.keys(ingredients)
        .map(igKey => {
            return ingredients[igKey]
        })
        .reduce((sum,el) => {
            return sum + el
        },0);
        return sum>0
    }

    purchaseHandler = () => {
        if(this.props.isAuthenticated){
            this.setState( {purchasing:true} )
        }
        else{
            this.props.onSetAuthRedirectPath('/checkout'); 
            this.props.history.push('/auth');
        }
        
    }

    purchaseCancelHandler = () => {
        this.setState( {purchasing:false} )
    }
    
    purchaseContinueHandler = () => {
        this.props.onInitPurchase();
        this.props.history.push('/checkout');
    }

    render() {
        const disabledInfo = {
            ...this.props.ings
        };

        for(let key in disabledInfo){
            disabledInfo[key] = disabledInfo[key] <= 0  
        }

        let orderSummary = null;
        let burger = this.props.error ? <p>Ingredients cannot be added </p>:<Spinner/>

        if(this.props.ings){
            burger = (
                <Aux>
                <Burger ingredients={this.props.ings} />
                        
                <BuildControls
                    ingredientAdded = {this.props.onIngredientAdded}
                    ingredientRemoved = {this.props.onIngredientRemoved} 
                    disabled = {disabledInfo}
                    price = {this.props.price}
                    ordered = {this.purchaseHandler}
                    purchasable = {this.updatePurchaseState(this.props.ings)}
                    isAuth = {this.props.token} 
                />
                </Aux>
                );  
                
            orderSummary = <OrderSummary 
                price={this.props.price}
                ingredients={this.props.ings}
                purchaseCancelled={this.purchaseCancelHandler}
                purchaseContinued={this.purchaseContinueHandler} />      
        }
    
        return(
            <Aux>
                <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
                    {orderSummary}
                </Modal>
                {burger}
            </Aux>
        );
    }
}

const mapStateToProps = state => {
    return {
        ings: state.burgerBuilder.ingredients,
        price: state.burgerBuilder.totalPrice,
        error: state.burgerBuilder.error,
        isAuthenticated : state.auth.token !== null
    };
}

const mapDispatchToProps = dispatch => {
    return {
        onIngredientAdded: (ingName) => dispatch(actions.addIngredient(ingName)) ,
        onIngredientRemoved: (ingName) => dispatch(actions.removeIngredient(ingName)),
        onInitIngredients: () => dispatch(actions.initIngredients()),
        onInitPurchase : () => dispatch(actions.purchaseInit()),
        onSetAuthRedirectPath: (path) => dispatch(actions.setAuthRedirectPath(path))
    }
} 

export default connect(mapStateToProps , mapDispatchToProps )(withErrorHandler(BurgerBuilder, axios));