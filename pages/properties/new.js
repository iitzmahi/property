import React,{Component} from 'react';
import Layout from '../../components/Layout';
import {Form,Button,Input,Message} from 'semantic-ui-react';
import factory from '../../ethereum/factory';
import web3 from '../../ethereum/web3';
import{Router} from '../../routes';
class PropertyNew extends Component
{
    state={
        pHeader:'',
        pDesc:'',
        pLoc:'',
        securityAmount:'',
        monthlyRent:'',
        lateCharge:'',
        errorMessage:'',
        loading:false,
    };

    onSubmit= async (event)=>{
        event.preventDefault();


        this.setState({loading:true,errorMessage:''});
        try{
            const accounts= await web3.eth.getAccounts();
        await factory.methods.createRent(this.state.securityAmount,this.state.pHeader,this.state.pDesc,this.state.pLoc,this.state.monthlyRent,this.state.lateCharge).send({
            from: accounts[0]
        });
        Router.pushRoute('/');
        }catch(err){
            this.setState({errorMessage:err.message})
        }
        this.setState({loading:false});
    };

    render()
    {
        return (
        <Layout >
        <h1 style={{color:'white',marginLeft:"10%"}}>Enter the following details</h1>
        <Form error={!!this.state.errorMessage} onSubmit={this.onSubmit} style={{marginLeft:"10%",marginRight:"10%"}}>
            <Form.Field>
                <label style={{color:'white'}}>Property Header</label>
                <Input
                    value={this.state.pHeader}
                    onChange={event=>this.setState({pHeader:event.target.value})}
                />
            </Form.Field>
            <Form.Field>
                <label style={{color:'white'}}>Property Description</label>
                <Input
                    value={this.state.pDesc}
                    onChange={event=>this.setState({pDesc:event.target.value})}
                />
            </Form.Field>
            <Form.Field>
                <label style={{color:'white'}}>Property Location</label>
                <Input
                    value={this.state.pLoc}
                    onChange={event=>this.setState({pLoc:event.target.value})}
                />
            </Form.Field>
            <Form.Field>
                <label style={{color:'white'}}>Security Amount</label>
                <Input label='wei' labelPosition='right'
                    value={this.state.securityAmount}
                    onChange={event=>this.setState({securityAmount:event.target.value})}
                />
            </Form.Field>
            <Form.Field>
                <label style={{color:'white'}}>Monthly Rent</label>
                <Input label='wei' labelPosition='right'
                    value={this.state.monthlyRent}
                    onChange={event=>this.setState({monthlyRent:event.target.value})}
                />
            </Form.Field>
            <Form.Field>
                <label style={{color:'white'}}>Late Charges</label>
                <Input label='wei' labelPosition='right'
                    value={this.state.lateCharge}
                    onChange={event=>this.setState({lateCharge:event.target.value})}
                />
            </Form.Field>
            <Message error header="Something went wrong" content={this.state.errorMessage}/>
            <Button loading={this.state.loading} positive>List</Button>
        </Form>
        </Layout>
        );
    }
}
export default PropertyNew;