


<Row className = 'positionsTableToolbar'>
            <Col span = { 20 }>
              <Button 
                icon = 'file' 
                size = 'small' />
              <Button 
                style = {{marginLeft: 5}}
                type = 'danger'
                icon = 'delete' 
                size = 'small' />

              <Divider 
                type="vertical"
                size = 'small' />

              <Dropdown 
                overlay={this.menu}
                >
                <Button
                  size = 'small'>
                  Завод ???<Icon type="down" />
                </Button>
              </Dropdown>

              <Dropdown 
                overlay={this.menu}
                >
                <Button
                  style = {{marginLeft: 5}}                  
                  size = 'small'>
                  Склад ???<Icon type="down" />
                </Button>
              </Dropdown>

              <Dropdown 
                overlay={this.menu} >
                <Button
                  style = {{marginLeft: 5}}
                  size = 'small'>
                  ЕИ длины<Icon type="down" />
                </Button>
              </Dropdown>

              <Dropdown 
                overlay={this.menu}
                >
                <Button
                  style = {{marginLeft: 5}}
                  size = 'small'>
                  АЕИ<Icon type="down" />
                </Button>
              </Dropdown>
              
              <Divider
                type="vertical" 
                size = 'small' />

              <Button 
                icon = 'tool' 
                size = 'small' />

              <Button 
                style = {{marginLeft: 5}}
                icon = 'car' 
                size = 'small' />

              <Button 
                style = {{marginLeft: 5}}
                type = 'danger' 
                size = 'small'>
                <Icon type="car" size = 'small' />
                <Icon type="delete" size = 'small'/>
              </Button>


            </Col>
            <Col span     = { 4 } >
              
                { this.props.isEditable &&
                <Button type     = "primary" 
                        icon     = "reload" 
                        loading  = { this.props.positions.isLoading }
                        style    = {{ float: 'right' }}
                        onClick  = { (event) => { this.onCalcPositionsSum(); } }  
                        size     = 'small' >
                    Рассчитать цены
                  </Button>
                }
                { !this.props.isEditable &&
                  <Popover content = { msg.content }
                          title   = { msg.title } >
                    <Button type     = "primary" 
                            icon     = "frown-o"
                            loading  = { this.props.positions.isLoading }
                            style    = {{ float: 'right' }}
                            onClick  = { (event) => { this.onCalcPositionsSum(); } }
                            size     = 'small'
                            disabled  >
                        Рассчитать цены
                    </Button>
                  </Popover>
                }
            </Col>
          </Row>