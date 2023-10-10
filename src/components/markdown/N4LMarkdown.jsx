import 'katex/dist/katex.min.css' // `rehype-katex` does not import the CSS for you
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import { Table, Image } from 'react-bootstrap'

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
                  return <ol className={'list-group'}>{props.children}</ol>
                },
                li (props) {
                  return <li className={'list-group-item'}>{props.children}</li>
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