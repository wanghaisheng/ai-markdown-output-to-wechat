import React from "react";
import {observer, inject} from "mobx-react";
import {Menu, Dropdown, message} from "antd";
import {CopyOutlined} from "@ant-design/icons";

@inject("view")
@inject("content")
@inject("dialog")
@observer
class MobileNavbar extends React.Component {
  handleEditClick = () => {
    this.props.view.toggleMobilePreviewMode(false);
  };

  handlePreviewClick = () => {
    this.props.view.toggleMobilePreviewMode(true);
  };

  handleSettingsClick = () => {
    this.props.dialog.setSettingOpen(true);
  };

  handleThemeClick = () => {
    this.props.dialog.setThemeOpen(true);
  };

  handleCopyToWechat = () => {
    try {
      const element = document.getElementById("nice-wx-box");
      this.copyToClipboard(element);
      message.success("已复制到剪贴板，可贴至公众号");
    } catch (e) {
      message.error("复制失败");
    }
  };

  handleCopyToZhihu = () => {
    try {
      const element = document.getElementById("nice-wx-box");
      this.copyToClipboard(element);
      message.success("已复制到剪贴板，可贴至知乎");
    } catch (e) {
      message.error("复制失败");
    }
  };

  handleCopyToJuejin = () => {
    try {
      const element = document.getElementById("nice-wx-box");
      this.copyToClipboard(element);
      message.success("已复制到剪贴板，可贴至稀土掘金");
    } catch (e) {
      message.error("复制失败");
    }
  };

  copyToClipboard = (element) => {
    if (!element) return;
    const range = document.createRange();
    range.selectNode(element);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    document.execCommand("copy");
    selection.removeAllRanges();
  };

  render() {
    const {isMobilePreviewMode} = this.props.view;

    const copyMenu = (
      <Menu>
        <Menu.Item key="wechat" onClick={this.handleCopyToWechat}>
          复制到公众号
        </Menu.Item>
        <Menu.Item key="zhihu" onClick={this.handleCopyToZhihu}>
          复制到知乎
        </Menu.Item>
        <Menu.Item key="juejin" onClick={this.handleCopyToJuejin}>
          复制到稀土掘金
        </Menu.Item>
      </Menu>
    );

    return (
      <div className="nice-mobile-navbar">
        <div className="nice-mobile-navbar-items">
          <div
            className={`nice-mobile-navbar-item ${!isMobilePreviewMode ? "active" : ""}`}
            onClick={this.handleEditClick}
          >
            <span className="nice-mobile-navbar-icon">✏️</span>
            <span>编辑</span>
          </div>
          <div
            className={`nice-mobile-navbar-item ${isMobilePreviewMode ? "active" : ""}`}
            onClick={this.handlePreviewClick}
          >
            <span className="nice-mobile-navbar-icon">👁️</span>
            <span>预览</span>
          </div>
          {isMobilePreviewMode && (
            <Dropdown overlay={copyMenu} placement="topCenter" trigger={["click"]}>
              <div className="nice-mobile-navbar-item">
                <CopyOutlined className="nice-mobile-navbar-icon" />
                <span>复制</span>
              </div>
            </Dropdown>
          )}
          <div className="nice-mobile-navbar-item" onClick={this.handleThemeClick}>
            <span className="nice-mobile-navbar-icon">🎨</span>
            <span>主题</span>
          </div>
          <div className="nice-mobile-navbar-item" onClick={this.handleSettingsClick}>
            <span className="nice-mobile-navbar-icon">⚙️</span>
            <span>设置</span>
          </div>
        </div>
      </div>
    );
  }
}

export default MobileNavbar;
