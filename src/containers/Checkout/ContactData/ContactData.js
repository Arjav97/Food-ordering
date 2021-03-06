import React , {Component} from 'react';
import Button from '../../../components/UI/Button/Button';
import classes from './ContactData.module.css';
import Spinner from '../../../components/UI/Spinner/Spinner';
import Input from '../../../components/UI/Input/Input';
import { connect } from 'react-redux';
import * as actions from '../../../store/actions/index';
import { updateObject , checkValidity } from '../../../shared/utility';

class ContactData extends Component {
    state={
        orderForm : {
            name: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Your name'
                },
                value: '',
                validation: {
                    required: true
                },
                valid:false,
                touched: false
            },
            street :  {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Street'
                },
                value: '',
                validation: {
                    required: true
                },
                valid:false,
                touched:false
            },
            zipcode: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'ZIP Code'
                },
                value: '',
                validation: {
                    required: true,
                    minLength:5,
                    maxLength:5
                },
                valid:false,
                touched: false
            },
            country: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Country'
                },
                value: '',
                validation: {
                    required: true
                },
                valid:false,
                touched: false
            },
            email: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Your e-mail'
                },
                value: '',
                validation: {
                    required: true
                },
                valid:false,
                touched: false
            },
            deliveryMethod: {
                elementType: 'select',
                elementConfig: {
                    options: [
                        {value: 'fastest' , displayValue:'Fastest'},
                        {value: 'cheapest', displayValue: 'Cheapest'}
                    ]    
                },
                value: 'fastest',
                validation: true,
                valid:true
            },
        },
        formisValid: false
    }

    orderHandler = (event) => {
        event.preventDefault();
        this.setState({loading: true})
        const formData = {}
        for(let formElementIdentifier in this.state.orderForm){
            formData[formElementIdentifier] = this.state.orderForm[formElementIdentifier].value;
        }
        const order = {
            ingredients: this.props.ings,
            price: this.props.price,
            orderData:formData,
            userId: this.props.userId
        }
        this.props.onOrderBurger(order , this.props.token);
       
    }

    inputChangedHandler = (event,inputIdentifier) => {
            const updatedFormElement = updateObject(this.state.orderForm[inputIdentifier] , {
               value: event.target.value,
               valid: checkValidity(this.state.orderForm[inputIdentifier].value , this.state.orderForm[inputIdentifier].validation ) , 
               touched: true
            })
            const updatedOrderForm = updateObject( this.state.orderForm , {
                [inputIdentifier] : updatedFormElement
            })
            let formisValid = true;
            for(let inputIdentifier in updatedOrderForm){
                formisValid = updatedOrderForm[inputIdentifier].valid && formisValid
            }
            this.setState({orderForm: updatedOrderForm , formisValid: formisValid})
    }

    render(){
        const formElementsArray = [];
        for(let key in this.state.orderForm){
            formElementsArray.push({
                id: key,
                config: this.state.orderForm[key]
            })
        }
        let form = (
        <form>  
            {
                formElementsArray.map(formElement => (
                    <Input 
                     key = {formElement.id}
                     elementType = {formElement.config.elementType} 
                     elementConfig = {formElement.config.elementConfig}
                     value = {formElement.config.value}
                     invalid = {!formElement.config.valid}
                     shouldValidate = { formElement.config.validation }
                     touched = { formElement.config.touched }
                     changed={(event) => this.inputChangedHandler(event,formElement.id)}
                     />
                ))
            }
           
            <Button btnType="Success" disabled={!this.state.formisValid} clicked={this.orderHandler} >Order</Button>
        </form>
        );
        
        if(this.props.loading){
            form = <Spinner />
        }
        
        return(
            <div className={classes.ContactData}>
                <h4>Enter your contact data</h4>
                {form}
            </div>

        )
    }
}

const mapStatetoProps = state => {
    return {
        ings: state.burgerBuilder.ingredients,
        price: state.burgerBuilder.totalPrice,
        loading: state.order.loading,
        token: state.auth.token,
        userId: state.auth.userId
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onOrderBurger : (orderData,token) => dispatch(actions.purchaseBurger(orderData,token))
    }
}

export default connect(mapStatetoProps , mapDispatchToProps)(ContactData);