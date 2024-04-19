import React from "react";
import { Spinner } from 'react-bootstrap';

interface LoadingViewProps {

  what?: string;
  fullMessage?: string;
}

function LoadingView(props: LoadingViewProps) {
  const msg = props.fullMessage ?? `Loading ${props.what}. Please wait...`;
  return <div style={{width: "parent", wordBreak: "break-all"}}><Spinner size="sm" animation="border" className="me-2"/><i>{msg}</i></div>
}

export default LoadingView;
