import React from "react";

interface UnauthorizedViewProps {
  loggedIn?: boolean | undefined;
}

function UnauthorizedView(props: UnauthorizedViewProps) {
  let msg = `Please log in to access this page.`;
  if (props?.loggedIn) {
    msg = 'You are not authorized to access this resource.'
  }
  return (
    <h4 className="m-2">{msg}</h4>
  )

}

export default UnauthorizedView;
