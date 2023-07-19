import React, {Component} from "react";
import {observer, inject} from "mobx-react";
import classnames from "classnames";

import File from "../component/MenuLeft/File";
import Pattern from "../component/MenuLeft/Pattern";
import Function from "../component/MenuLeft/Function";
import Theme from "../component/MenuLeft/Theme";
import CodeTheme from "../component/MenuLeft/CodeTheme";
import Setting from "../component/MenuLeft/Setting";
import View from "../component/MenuLeft/View";

import "./Navbar.css";

@inject("view")
@observer
class Navbar extends Component {
  render() {
    const {title, token} = this.props;
    const {isImmersiveEditing} = this.props.view;
    const niceNavbarClass = classnames({
      "nice-navbar": true,
      "nice-navbar-hide": isImmersiveEditing,
    });
    return (
      <div className={niceNavbarClass}>
        <div className="nice-left-nav">
          {title === "" ? null : (
            <section id="nice-title" className="nice-title">
              {title}
            </section>
          )}
          <File />
          <Pattern />
          <Function />
          <View />
          <Theme token={token} />
          <CodeTheme />
          <Setting />
        </div>
        <div className="nice-right-nav">
          <a className="nice-title nice-link" href="https://www.jeffjade.com/nicelinks/?ref=wechat.jeffjade.com">
            晚晴幽草轩
          </a>
          <a className="nice-title nice-link" href="https://nicelinks.site?ref=wechat.jeffjade.com">
            倾城之链
          </a>
          <a className="nice-title nice-link" href="https://chatgpt.nicelinks.site/?ref=wechat.jeffjade.com">
            素问智聊斋
          </a>
        </div>
      </div>
    );
  }
}

export default Navbar;
