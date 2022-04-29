import React,{Component} from 'react';
import { Button, Icon } from 'semantic-ui-react';
import Layout from '../../components/Layout';
import {Link} from '../../routes'
class RentShowProperty extends Component
{
    render() {
        return (
            <Layout>
                <div style={{marginLeft:'26.5%',marginTop:'100px'}} class="ui cards">
  <div class="card">
    <div class="content">
      <div class="header" style={{color:'red'}}>Listed Properties</div>
      <div class="description" style={{color:'black'}}>
        Click on the button below to view the properties that you have Listed on this platform
      </div>
    </div>
    <Link route="/viewProperty/listed/showListed">
    <Button> <i class="search icon"></i></Button></Link>
  </div>
  <div class="card">
    <div class="content">
      <div class="header" style={{color:'red'}}>Rented Properties</div>
      <div class="description" style={{color:'black'}}>
        Click on the button below to view the properties that you have Rented on this platform
      </div>
    </div>
    <Button> <i class="search icon"></i></Button>
  </div>
  <div class="card">
    <div class="content">
      <div class="header" style={{color:'red'}}>Search Properties</div>
      <div class="description" style={{color:'black'}}>
        Click on the button below to view the properties that are available for you to take on leese
      </div>
    </div>
    <Link route="/">
    <Button> <i class="search icon"></i></Button></Link>
  </div>
</div>
            </Layout>
        );
    }
}

export default RentShowProperty;