import React from "react";
import {observer, inject} from "mobx-react";
import SvgIcon from "../icon";

import "./MobileFooter.css";

@inject("content")
@observer
class MobileFooter extends React.Component {
  render() {
    if (!this.props.isMobileDevice) {
      return null;
    }
    
    const {content} = this.props.content;
    const wordCount = content.length;
    
    return (
      <div className="nice-mobile-footer">
        <div className="nice-mobile-footer-item" onClick={() => this.props.onAction('bold')}>
          <SvgIcon name="bold" />
        </div>
        <div className="nice-mobile-footer-item" onClick={() => this.props.onAction('italic')}>
          <SvgIcon name="italic" />
        </div>
        <div className="nice-mobile-footer-item" onClick={() => this.props.onAction('list')}>
          <SvgIcon name="list" />
        </div>
        <div className="nice-mobile-footer-item" onClick={() => this.props.onAction('image')}>
          <SvgIcon name="image" />
        </div>
        <div className="nice-mobile-footer-item nice-mobile-footer-count">
          {wordCount}字
        </div>
      </div>
    );
  }
}

export default MobileFooter;