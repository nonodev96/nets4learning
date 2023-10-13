import 'katex/dist/katex.min.css' // `rehype-katex` does not import the CSS for you
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import { Table, Image } from 'react-bootstrap'

import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter'
import { darcula } from 'react-syntax-highlighter/dist/cjs/styles/prism'

import markdown from 'react-syntax-highlighter/dist/esm/languages/prism/markdown'
import js from 'react-syntax-highlighter/dist/esm/languages/prism/javascript'
import jsx from 'react-syntax-highlighter/dist/esm/languages/prism/jsx'

SyntaxHighlighter.registerLanguage('markdown', markdown)
SyntaxHighlighter.registerLanguage('javascript', js)
SyntaxHighlighter.registerLanguage('jsx', jsx)

export default function N4LMarkdown (_props_) {

  return <>
    <Markdown remarkPlugins={[remarkGfm, remarkMath]}
              rehypePlugins={[rehypeKatex]}
              components={{
                h1: 'h4',
                h2: 'h4',
                h3: 'h4',
                h4: 'h5',
                h5: 'h6',
                code (props) {
                  const { children, className, node, ...rest } = props
                  const match = /language-(\w+)/.exec(className || '')
                  if (match) {
                    return <SyntaxHighlighter style={darcula}
                                              PreTag="div"
                                              language={match[1]}
                                              children={String(children).replace(/\n$/, '')}
                                              {...rest}
                    />
                  } else {
                    return <code className={className ? className : ''} {...rest}>{children}</code>
                  }
                },
                input (props) {
                  const { node, ...rest } = props
                  if (props.type === 'checkbox')
                    return <input type={'checkbox'} className={'form-check-input me-1'} {...rest} />
                  else return <>Todo</>
                },
                img (props) {
                  const { node, ...rest } = props
                  return <Image fluid={true}
                                rounded={true}
                                thumbnail={true}
                                src={rest.src}
                                alt={rest.alt}
                  />
                },
                blockquote (props) {
                  const { node, ...rest } = props
                  return <blockquote className={'blockquote'} {...rest} />
                },
                p (props) {
                  const { node, ...rest } = props
                  return <p className={'mb-0'}{...rest} />
                },
                ul (props) {
                  return <ul className={'list-group'}>{props.children}</ul>
                },
                ol (props) {
                  // return <ol className={'list-group'}>{props.children}</ol>
                  return <ol>{props.children}</ol>
                },
                li (props) {
                  // return <li className={'list-group-item'}>{props.children}</li>
                  return <li>{props.children}</li>
                },
                table (props) {
                  const { node, ...rest } = props
                  return <Table striped={true}
                                bordered={true}
                                borderless={true}
                                hover={true}
                                size={'sm'}
                                responsive={true}
                                {...rest}
                  />
                }
              }}>
      {_props_.children}
    </Markdown>
  </>
}