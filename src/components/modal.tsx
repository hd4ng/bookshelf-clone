/** @jsx jsx */
/** @jsxFrag React.Fragment */
import {jsx} from '@emotion/core'

import React, {
  SetStateAction,
  Dispatch,
  createContext,
  useState,
  useContext,
  ReactElement,
} from 'react'
import {Dialog, CircleButton} from './lib'
import VisuallyHidden from '@reach/visually-hidden'

const callAll = (...fns: Function[]) => (...args: any[]) =>
  fns.forEach(fn => fn && fn(...args))

type IModalContext = [boolean, Dispatch<SetStateAction<boolean>>]

const ModalContext = createContext<IModalContext | undefined>(undefined)

const Modal: React.FC = ({children}) => {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <ModalContext.Provider value={[isOpen, setIsOpen]} children={children} />
  )
}

const ModalDismissButton: React.FC<{children: ReactElement}> = ({
  children: child,
}) => {
  const [, setIsOpen] = useContext(ModalContext) as IModalContext
  return React.cloneElement(child, {
    onClick: callAll(() => setIsOpen(false), child.props.onClick),
  })
}

const ModalOpenButton: React.FC<{children: ReactElement}> = ({
  children: child,
}) => {
  const [, setIsOpen] = useContext(ModalContext) as IModalContext
  return React.cloneElement(child, {
    onClick: callAll(() => setIsOpen(true), child.props.onClick),
  })
}

const ModalContentsBase: React.FC = props => {
  const [isOpen, setIsOpen] = useContext(ModalContext) as IModalContext
  return (
    <Dialog isOpen={isOpen} onDismiss={() => setIsOpen(false)} {...props} />
  )
}

function ModalContents({
  title,
  children,
  ...props
}: React.PropsWithChildren<{title: string}>) {
  return (
    <ModalContentsBase {...props}>
      <div css={{display: 'flex', justifyContent: 'flex-end'}}>
        <ModalDismissButton>
          <CircleButton>
            <VisuallyHidden>Close</VisuallyHidden>
            <span aria-hidden>x</span>
          </CircleButton>
        </ModalDismissButton>
      </div>
      <h3 css={{textAlign: 'center', fontSize: '2em'}}>{title}</h3>
      {children}
    </ModalContentsBase>
  )
}

export {
  Modal,
  ModalDismissButton,
  ModalOpenButton,
  ModalContents,
  ModalContentsBase,
}
