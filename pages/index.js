import React,{Component} from 'react';
import { Card,Button ,Statistic} from 'semantic-ui-react';
import factory from '../ethereum/factory';
import Layout from '../components/Layout';
class PropertyIndex extends Component
{
    static async getInitialProps()
    {
        const properties = await factory.methods.getDeployedRentContract().call();
        return {properties};
    }

    renderProperties()
    {
        const items = this.props.properties.map(address=>
            {
                return{
                    header: address,
                    description:<a>Click to view property</a>,
                    fluid:true
                };
            });
        return <Card.Group style={{marginLeft:'20%'}} items={items}/>;  
    }
    render()
    {
        return(
        <Layout> 
        <div>
        
        <Button
            style={{marginTop:'11px',marginRight:'20%'}}
            content="Add Your Listing"
            icon="add circle"
            positive
            floated='right'
         />
         {this.renderProperties()}
         <Statistic color='green' inverted>
      <Statistic.Value>{this.props.properties.length}</Statistic.Value>
      <Statistic.Label>Properties Listed So Far</Statistic.Label>
    </Statistic>
        </div>;
        </Layout>
        );
    }
}

export default PropertyIndex;