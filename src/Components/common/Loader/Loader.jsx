import s from "./Loader.module.scss";
import Spinner from 'react-bootstrap/Spinner';

export default function Loader(props) {
    const { show = false, children } = props;
    return (
        <div className={s.parent}>
            {show ? <div className={s.spinner}>
                <Spinner animation="border" role="status" variant="secondary">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </div> : ""}
            {children}
        </div>
    )
}