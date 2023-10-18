type props = {
  error: string
}

const ErrorElement = (props: props) => {
  return (
    <span className='text-danger'>{props.error}</span>
  )
}

export default ErrorElement