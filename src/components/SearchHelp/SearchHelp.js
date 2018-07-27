import React                    from 'react';
import { Spin, Modal }          from 'antd';
import PropTypes                from 'prop-types';
import { SearchResultList }     from '.';


export class SearchHelp extends React.Component {
  static propTypes = {   
    data:           PropTypes.array.isRequired,
    columns:        PropTypes.array.isRequired,
    visible:        PropTypes.bool.isRequired,
    onSelect:       PropTypes.func.isRequired,
    loading:        PropTypes.bool.isOptional,
    multiple:       PropTypes.bool.isOptional,
  }

  loading       = false;
  data          = [];
  selectedKeys  = [];

  constructor(props)
  {
    super(props);
  }

  localOnSelect = (keys, records) =>
  {
    this.selectedKeys = keys.map( key => parseInt(key, 10));

    //если одиночный выбор - эмулируем нажатие кнопки Ок
    if(!this.props.multiple)
    {
      this.onOk();
    }
  }

  onOk = () =>
  {
    let result;

    if(this.selectedKeys.length === 1)
    {
      let result = this.props.data[this.selectedKeys[0]];
      if(typeof this.props.onSelect === 'function')
      {
        this.props.onSelect(result);
      }
    }
    else
    {
      let result = [];
      for(let i = 0; i < this.selectedKeys.length; i++)
      {
        result.push(this.props.data[this.selectedKeys[i]]);
      }
      if(typeof this.props.onSelect === 'function')
      {
        this.props.onSelect(result);
      }
    }

    this.selectedKeys = [];    
  }

  componentWillReceiveProps(newProps)
  {
    this.loading = false;
    if(newProps.loading)
    {
      this.loading = true;
    }

    if(this.props.data !== newProps.data)
    {
      this.data = newProps.data.map((record, index) => {
        record.key = index.toString();
        return record;
      });
    }
  }
 
  render()
  {
    let { onSelect, data, ...restProps } = this.props;
    return(
      <Modal
        title     = 'Поиск'
        visible   = { this.props.visible }
        onOk      = { this.onOk }
      >
        <Spin spinning = { this.loading } >
          <SearchResultList 
            data      = { this.data }
            onSelect  = { this.localOnSelect }
            { ...restProps }
            />
        </Spin>
      </Modal>
    );
  }
}

export default SearchHelp;