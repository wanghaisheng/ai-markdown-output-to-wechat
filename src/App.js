import React, {Component} from "react";
import CodeMirror from "@uiw/react-codemirror";
import "codemirror/addon/search/searchcursor";
import "codemirror/keymap/sublime";
import "codemirror/addon/edit/closebrackets";
import "codemirror/addon/edit/matchbrackets";
import "codemirror/addon/hint/show-hint";
import "codemirror/addon/hint/show-hint.css";
import "antd/dist/antd.css";
import {observer, inject} from "mobx-react";
import classnames from "classnames";
import throttle from "lodash.throttle";
import MobileNavbar from "./component/MobileNavbar";
import Dialog from "./layout/Dialog";
import Navbar from "./layout/Navbar";
import Footer from "./layout/Footer";
import Sidebar from "./layout/Sidebar";
import StyleEditor from "./layout/StyleEditor";
import EditorMenu from "./layout/EditorMenu";
import SearchBox from "./component/SearchBox";
import TEMPLATE from "./template/index";
import {version} from "../package.json";

import "./App.css";
import "./utils/mdMirror.css";

import {
  LAYOUT_ID,
  BOX_ID,
  IMAGE_HOSTING_NAMES,
  IMAGE_HOSTING_TYPE,
  MJX_DATA_FORMULA,
  MJX_DATA_FORMULA_TYPE,
  MAX_MD_NUMBER,
  THROTTLE_MATHJAX_TIME,
  THROTTLE_MD_RENDER_TIME,
} from "./utils/constant";
import {markdownParser, updateMathjax} from "./utils/helper";
import pluginCenter from "./utils/pluginCenter";
import appContext from "./utils/appContext";
import {uploadAdaptor} from "./utils/imageHosting";
import bindHotkeys, {betterTab, rightClick} from "./utils/hotkey";
// 在顶部导入部分添加
import {message} from "antd";

console.log(`「Markdown 在线编辑器 | 公众号内容排版工具」当前版本为：`, version);

@inject("content")
@inject("navbar")
@inject("footer")
@inject("view")
@inject("dialog")
@inject("imageHosting")
@observer
class App extends Component {
  constructor(props) {
    super(props);
    this.scale = 1;
    this.handleUpdateMathjax = throttle(updateMathjax, THROTTLE_MATHJAX_TIME);
    this.handleThrottleChange = throttle(this.handleChange, THROTTLE_MD_RENDER_TIME);
    this.state = {
      focus: false,
    };
  }

  componentDidMount() {
    document.addEventListener("fullscreenchange", this.solveScreenChange);
    document.addEventListener("webkitfullscreenchange", this.solveScreenChange);
    document.addEventListener("mozfullscreenchange", this.solveScreenChange);
    document.addEventListener("MSFullscreenChange", this.solveScreenChange);
    try {
      window.MathJax = {
        tex: {
          inlineMath: [["$", "$"]],
          displayMath: [["$$", "$$"]],
          tags: "ams",
        },
        svg: {
          fontCache: "none",
        },
        options: {
          renderActions: {
            addMenu: [0, "", ""],
            addContainer: [
              190,
              (doc) => {
                for (const math of doc.math) {
                  this.addContainer(math, doc);
                }
              },
              this.addContainer,
            ],
          },
        },
      };
      // eslint-disable-next-line
      require("mathjax/es5/tex-svg-full");
      pluginCenter.mathjax = true;
    } catch (e) {
      console.log(e);
    }
    this.setEditorContent();
    this.setCustomImageHosting();
  }

  componentDidUpdate() {
    if (pluginCenter.mathjax) {
      this.handleUpdateMathjax();
    }
  }

  componentWillUnmount() {
    document.removeEventListener("fullscreenchange", this.solveScreenChange);
    document.removeEventListener("webkitfullscreenchange", this.solveScreenChange);
    document.removeEventListener("mozfullscreenchange", this.solveScreenChange);
    document.removeEventListener("MSFullscreenChange", this.solveScreenChange);
  }

  setCustomImageHosting = () => {
    if (this.props.useImageHosting === undefined) {
      return;
    }
    const {url, name, isSmmsOpen, isQiniuyunOpen, isAliyunOpen, isGiteeOpen, isGitHubOpen} = this.props.useImageHosting;
    if (name) {
      this.props.imageHosting.setHostingUrl(url);
      this.props.imageHosting.setHostingName(name);
      this.props.imageHosting.addImageHosting(name);
    }
    if (isSmmsOpen) {
      this.props.imageHosting.addImageHosting(IMAGE_HOSTING_NAMES.smms);
    }
    if (isAliyunOpen) {
      this.props.imageHosting.addImageHosting(IMAGE_HOSTING_NAMES.aliyun);
    }
    if (isQiniuyunOpen) {
      this.props.imageHosting.addImageHosting(IMAGE_HOSTING_NAMES.qiniuyun);
    }
    if (isGiteeOpen) {
      this.props.imageHosting.addImageHosting(IMAGE_HOSTING_NAMES.gitee);
    }
    if (isGitHubOpen) {
      this.props.imageHosting.addImageHosting(IMAGE_HOSTING_NAMES.github);
    }

    // 第一次进入没有默认图床时
    if (window.localStorage.getItem(IMAGE_HOSTING_TYPE) === null) {
      let type;
      if (name) {
        type = name;
      } else if (isSmmsOpen) {
        type = IMAGE_HOSTING_NAMES.smms;
      } else if (isAliyunOpen) {
        type = IMAGE_HOSTING_NAMES.aliyun;
      } else if (isQiniuyunOpen) {
        type = IMAGE_HOSTING_NAMES.qiniuyun;
      } else if (isGiteeOpen) {
        type = IMAGE_HOSTING_NAMES.isGitee;
      }
      this.props.imageHosting.setType(type);
      window.localStorage.setItem(IMAGE_HOSTING_TYPE, type);
    }
  };

  setEditorContent = () => {
    const content = window.localStorage.getItem("editor-content") || TEMPLATE.content;
    this.props.content.setContent(content);
  };

  setCurrentIndex(index) {
    this.index = index;
  }

  solveScreenChange = () => {
    const {isImmersiveEditing} = this.props.view;
    this.props.view.setImmersiveEditing(!isImmersiveEditing);
  };

  getInstance = (instance) => {
    instance.editor.on("inputRead", function(cm, event) {
      if (event.origin === "paste") {
        var text = event.text[0]; // pasted string
        var new_text = ""; // any operations here
        cm.refresh();
        const {length} = cm.getSelections();
        // my first idea was
        // note: for multiline strings may need more complex calculations
        cm.replaceRange(new_text, event.from, {line: event.from.line, ch: event.from.ch + text.length});
        // first solution did'nt work (before i guess to call refresh) so i tried that way, works too
        if (length === 1) {
          cm.execCommand("undo");
        }
        // cm.setCursor(event.from);
        cm.replaceSelection(new_text);
      }
    });
    if (instance) {
      this.props.content.setMarkdownEditor(instance.editor);
    }
  };

  handleScroll = () => {
    if (this.props.navbar.isSyncScroll) {
      const {markdownEditor} = this.props.content;
      const cmData = markdownEditor.getScrollInfo();
      const editorToTop = cmData.top;
      const editorScrollHeight = cmData.height - cmData.clientHeight;
      this.scale = (this.previewWrap.offsetHeight - this.previewContainer.offsetHeight + 55) / editorScrollHeight;
      if (this.index === 1) {
        this.previewContainer.scrollTop = editorToTop * this.scale;
      } else {
        this.editorTop = this.previewContainer.scrollTop / this.scale;
        markdownEditor.scrollTo(null, this.editorTop);
      }
    }
  };

  handleChange = (editor) => {
    if (this.state.focus) {
      const content = editor.getValue();
      if (content.length > MAX_MD_NUMBER) {
        message.error(`字符数超过 ${MAX_MD_NUMBER}`);
        return;
      }
      this.props.content.setContent(content);
      this.props.onTextChange && this.props.onTextChange(content);
    }
  };

  handleFocus = (editor) => {
    this.setState({
      focus: true,
    });
    this.props.onTextFocus && this.props.onTextFocus(editor.getValue());
  };

  handleBlur = (editor) => {
    this.setState({
      focus: false,
    });
    this.props.onTextBlur && this.props.onTextBlur(editor.getValue());
  };

  getStyleInstance = (instance) => {
    if (instance) {
      this.styleEditor = instance.editor;
      this.styleEditor.on("keyup", (cm, e) => {
        if ((e.keyCode >= 65 && e.keyCode <= 90) || e.keyCode === 189) {
          cm.showHint(e);
        }
      });
    }
  };

  handleDrop = (instance, e) => {
    if (!(e.dataTransfer && e.dataTransfer.files)) {
      return;
    }
    for (let i = 0; i < e.dataTransfer.files.length; i++) {
      uploadAdaptor({file: e.dataTransfer.files[i], content: this.props.content});
    }
  };

  handlePaste = (instance, e) => {
    const cbData = e.clipboardData;

    const insertPasteContent = (cm, content) => {
      const {length} = cm.getSelections();
      cm.replaceSelections(Array(length).fill(content));
      this.setState(
        {
          focus: true,
        },
        () => {
          this.handleThrottleChange(cm);
        },
      );
    };

    if (e.clipboardData && e.clipboardData.files) {
      for (let i = 0; i < e.clipboardData.files.length; i++) {
        uploadAdaptor({file: e.clipboardData.files[i], content: this.props.content});
      }
    }

    if (cbData) {
      const html = cbData.getData("text/html");
      const text = cbData.getData("TEXT");
      insertPasteContent(instance, text);
      if (html) {
        this.props.footer.setPasteHtmlChecked(true);
        this.props.footer.setPasteHtml(html);
        this.props.footer.setPasteText(text);
      } else {
        this.props.footer.setPasteHtmlChecked(false);
      }
    }
  };

  addContainer(math, doc) {
    const tag = "span";
    const spanClass = math.display ? "span-block-equation" : "span-inline-equation";
    const cls = math.display ? "block-equation" : "inline-equation";
    math.typesetRoot.className = cls;
    math.typesetRoot.setAttribute(MJX_DATA_FORMULA, math.math);
    math.typesetRoot.setAttribute(MJX_DATA_FORMULA_TYPE, cls);
    math.typesetRoot = doc.adaptor.node(tag, {class: spanClass, style: "cursor:pointer"}, [math.typesetRoot]);
  }

  render() {
    const {previewType} = this.props.navbar;
    const {
      isEditAreaOpen,
      isPreviewAreaOpen,
      isStyleEditorOpen,
      isImmersiveEditing,
      isMobileDevice,
      isMobilePreviewMode,
    } = this.props.view;
    const {isSearchOpen} = this.props.dialog;
    const parseHtml = markdownParser.render(this.props.content.content);

    // 恢复原始类名逻辑，同时保留移动端改进
    const containerClasses = {
      app: classnames("nice-app", {
        "nice-mobile-container": isMobileDevice,
      }),
      textContainer: classnames({
        "nice-text-container": !isImmersiveEditing && !isMobileDevice,
        "nice-text-container-immersive": isImmersiveEditing && !isMobileDevice,
        "nice-text-container-mobile": isMobileDevice,
      }),
      mdEditing: classnames({
        "nice-md-editing": !isImmersiveEditing,
        "nice-md-editing-immersive": isImmersiveEditing,
        "nice-md-editing-hide": !isEditAreaOpen || (isMobileDevice && isMobilePreviewMode),
        "nice-md-editing-mobile": isMobileDevice,
      }),
      richText: classnames({
        "nice-marked-text": true,
        "nice-marked-text-pc": previewType === "pc",
        "nice-marked-text-hide": isImmersiveEditing || !isPreviewAreaOpen || (isMobileDevice && !isMobilePreviewMode),
        "nice-preview-mobile": isMobileDevice,
      }),
      richTextBox: classnames({
        "nice-wx-box": true,
        "nice-wx-box-pc": previewType === "pc",
        "nice-wx-box-mobile": isMobileDevice,
      }),
    };

    return (
      <appContext.Consumer>
        {({defaultTitle, onStyleChange, onStyleBlur, onStyleFocus, token}) => (
          <div className={containerClasses.app}>
            {/* 只在非移动设备上显示顶部导航栏 */}
            {!isMobileDevice && <Navbar title={defaultTitle} token={token} />}
            <div className={containerClasses.textContainer}>
              <div
                id="nice-md-editor"
                className={containerClasses.mdEditing}
                onMouseOver={(e) => this.setCurrentIndex(1, e)}
              >
                {isSearchOpen && <SearchBox />}
                <CodeMirror
                  value={this.props.content.content}
                  options={{
                    theme: "md-mirror",
                    keyMap: "sublime",
                    mode: "markdown",
                    lineWrapping: true,
                    lineNumbers: false,
                    extraKeys: {
                      ...bindHotkeys(this.props.content, this.props.dialog),
                      Tab: betterTab,
                      RightClick: rightClick,
                    },
                  }}
                  onChange={this.handleThrottleChange}
                  onScroll={this.handleScroll}
                  onFocus={this.handleFocus}
                  onBlur={this.handleBlur}
                  onDrop={this.handleDrop}
                  onPaste={this.handlePaste}
                  ref={this.getInstance}
                />
              </div>
              <div
                id="nice-rich-text"
                className={containerClasses.richText}
                onMouseOver={(e) => this.setCurrentIndex(2, e)}
              >
                <Sidebar />
                <div
                  id={BOX_ID}
                  className={containerClasses.richTextBox}
                  onScroll={this.handleScroll}
                  ref={(node) => {
                    this.previewContainer = node;
                  }}
                >
                  <section
                    id={LAYOUT_ID}
                    data-tool="mdnice编辑器"
                    data-website="https://wechat.jeffjade.com/"
                    dangerouslySetInnerHTML={{
                      __html: parseHtml,
                    }}
                    ref={(node) => {
                      this.previewWrap = node;
                    }}
                  />
                </div>
              </div>

              {isStyleEditorOpen && (
                <div id="nice-style-editor" className={containerClasses.styleEditing}>
                  <StyleEditor onStyleChange={onStyleChange} onStyleBlur={onStyleBlur} onStyleFocus={onStyleFocus} />
                </div>
              )}

              <Dialog />
              <EditorMenu />
            </div>
            {/* 在移动设备上显示底部导航栏，在非移动设备上显示底部栏 */}
            {isMobileDevice ? <MobileNavbar /> : <Footer />}
          </div>
        )}
      </appContext.Consumer>
    );
  }
}
export default App;
