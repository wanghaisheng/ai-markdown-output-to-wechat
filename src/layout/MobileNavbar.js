import React, {Component} from "react";
import {observer, inject} from "mobx-react";
import {Menu, Dropdown, Button} from "antd";
import SvgIcon from "../icon";

import "./MobileNavbar.css";

@inject("view")
@inject("content")
@observer
class MobileNavbar extends Component {
  state = {
    menuVisible: false
  };
  
  toggleMenu = () => {
    this.setState({menuVisible: !this.state.menuVisible});
  };
  
  handleMenuClick = ({key}) => {
    switch(key) {
      case 'import':
        document.getElementById('importFile').click();
        break;
      case 'export':
        // 导出功能
        break;
      case 'copy-wechat':
        // 复制到微信
        break;
      case 'copy-zhihu':
        // 复制到知乎
        break;
      case 'theme':
        // 切换主题
        break;
      default:
        break;
    }
    this.setState({menuVisible: false});
  };
  
  render() {
    const menu = (
      <Menu onClick={this.handleMenuClick}>
        <Menu.Item key="import">导入</Menu.Item>
        <Menu.Item key="export">导出</Menu.Item>
        <Menu.Divider />
        <Menu.Item key="copy-wechat">复制到微信</Menu.Item>
        <Menu.Item key="copy-zhihu">复制到知乎</Menu.Item>
        <Menu.Divider />
        <Menu.Item key="theme">切换主题</Menu.Item>
      </Menu>
    );
    
    return (
      <div className="nice-mobile-navbar">
        <div className="nice-mobile-title">{this.props.title || 'Markdown编辑器'}</div>
        <Dropdown overlay={menu} trigger={['click']} visible={this.state.menuVisible}>
          <Button type="text" onClick={this.toggleMenu}>
            <SvgIcon name="menu" />
          </Button>
        </Dropdown>
      </div>
    );
  }
}

export default MobileNavbar;