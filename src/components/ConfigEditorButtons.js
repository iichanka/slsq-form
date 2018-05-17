import React                            from 'react';
import { Button }                       from 'antd';
import { toggleConfiguratorVisible }    from '../actions/configs/main';
import { togglePersonalizationActive }  from '../actions/configs/main';

const ButtonGroup = Button.Group;

export const ConfigEditorButtons = ( {isPersonalizationActive, isConfiguratorVisible, dispatch, ...props}) => {
  let personalizationButton = isPersonalizationActive ?
    <Button 
      type    = 'danger' 
      icon    = 'unlock' 
      onClick = { event => { dispatch(togglePersonalizationActive()); } }
      style   = {{ top: -2 }}/> :
    <Button 
      type    = 'primary' 
      icon    = 'lock' 
      onClick = { event => { dispatch(togglePersonalizationActive()); } }
      style   = {{ top: -2 }}/>;
    
  let configurationButton = isPersonalizationActive ?
    <Button 
      type    = 'primary' 
      icon    = 'setting' 
      style   = {{ top: -2 }}
      disabled /> :
    <Button 
      type    = 'primary' 
      icon    = 'setting' 
      onClick = { event => { dispatch(toggleConfiguratorVisible()); } }
      style   = {{ top: -2 }}/>;

  return(
    <ButtonGroup>
      { personalizationButton }
      { configurationButton }
    </ButtonGroup>
  );
}