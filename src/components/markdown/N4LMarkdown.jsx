import 'katex/dist/katex.min.css' // `rehype-katex` does not import the CSS for you
import Markdown from 'react-markdown'
import rehypeDocument from 'rehype-document'
import rehypeFormat from 'rehype-format'
import rehypeStringify from 'rehype-stringify'
import rehypeKatex from 'rehype-katex'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'

import rehypeRaw from 'rehype-raw'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'

import { Table, Image } from 'react-bootstrap'

import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter'
import { darcula } from 'react-syntax-highlighter/dist/cjs/styles/prism'

import markdown from 'react-syntax-highlighter/dist/esm/languages/prism/markdown'
import typescript from 'react-syntax-highlighter/dist/esm/languages/prism/typescript'
import js from 'react-syntax-highlighter/dist/esm/languages/prism/javascript'
import jsx from 'react-syntax-highlighter/dist/esm/languages/prism/jsx'
import jsdoc from 'react-syntax-highlighter/dist/esm/languages/prism/jsdoc'

SyntaxHighlighter.registerLanguage('markdown', markdown)
SyntaxHighlighter.registerLanguage('typescript', typescript)
SyntaxHighlighter.registerLanguage('javascript', js)
SyntaxHighlighter.registerLanguage('jsx', jsx)
SyntaxHighlighter.registerLanguage('jsdoc', jsdoc)

export default function N4LMarkdown (_props_) {

  return <>
    <Markdown className={'text-nowrap'}
              remarkPlugins={[remarkGfm, remarkRehype, remarkMath]}
              rehypePlugins={[rehypeRaw, rehypeKatex, rehypeFormat]}
              components={{
                h1: 'h3',
                h2: 'h4',
                h3: 'h5',
                h4: 'h6',
                details (props) {
                  const { children, open, className, ...rest } = props
                  return <details className={className} open={open}>{children}</details>
                },
                summary (props) {
                  const { children, className, ...rest } = props
                  return <summary className={className}>{children}</summary>
                },
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
                  const { node, className, children, ...rest } = props
                  return <p className={'mb-2'}>{children}</p>
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
              }}>{_props_.children}</Markdown>
  </>
}