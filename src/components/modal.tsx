import React, {
  SetStateAction,
  Dispatch,
  createContext,
  useState,
  useContext,
  ReactElement,
} from "react"
import { Dialog } from "./lib"

const callAll = (...fns: Function[]) => (...args: any[]) =>
  fns.forEach((fn) => fn && fn(...args))

type IModalContext = [boolean, Dispatch<SetStateAction<boolean>>]

const ModalContext = createContext<IModalContext | undefined>(undefined)

const Modal: React.FC = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <ModalContext.Provider value={[isOpen, setIsOpen]} children={children} />
  )
}

const ModalDismissButton: React.FC<{ children: ReactElement }> = ({
  children: child,
}) => {
  const [, setIsOpen] = useContext(ModalContext) as IModalContext
  return React.cloneElement(child, {
    onClick: callAll(() => setIsOpen(false), child.props.onClick),
  })
}

const ModalOpenButton: React.FC<{ children: ReactElement }> = ({
  children: child,
}) => {
  const [, setIsOpen] = useContext(ModalContext) as IModalContext
  return React.cloneElement(child, {
    onClick: callAll(() => setIsOpen(true), child.props.onClick),
  })
}

const ModalContents: React.FC = (props) => {
  const [isOpen, setIsOpen] = useContext(ModalContext) as IModalContext
  return (
    <Dialog isOpen={isOpen} onDismiss={() => setIsOpen(false)} {...props} />
  )
}

export { Modal, ModalDismissButton, ModalOpenButton, ModalContents }
