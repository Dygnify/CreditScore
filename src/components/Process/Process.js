import { useEffect, useRef } from "react";
import classes from "./process.module.css";
import React, { Fragment } from "react";

const Backdrop = (props) => {
	return <div className={classes.backdrop} onClick={props.onHideCart} />;
};

const ModelOverlay = (props) => {
	return (
		<div className={classes.modal}>
			<div className={classes.content}>{props.children}</div>
		</div>
	);
};

const Process = ({ handleProcess }) => {
	const buttonRef = useRef(null);

	useEffect(() => {
		buttonRef.current.focus();
	}, []);
	return (
		<Fragment>
			<Backdrop onHideCart={handleProcess} />
			<ModelOverlay>
				<div className={classes.actions}>
					<button onClick={handleProcess} ref={buttonRef}>
						<svg
							width="19"
							height="19"
							viewBox="0 0 19 19"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								d="M18.4599 3.44488C18.8504 3.05436 18.8504 2.42119 18.4599 2.03067L17.1361 0.706924C16.7456 0.3164 16.1124 0.316399 15.7219 0.706924L9.58364 6.84519L3.44537 0.706924C3.05485 0.3164 2.42168 0.316399 2.03116 0.706924L0.707412 2.03067C0.316888 2.42119 0.316888 3.05436 0.707412 3.44488L6.84568 9.58315L0.707412 15.7214C0.316888 16.1119 0.316888 16.7451 0.707412 17.1356L2.03116 18.4594C2.42168 18.8499 3.05485 18.8499 3.44537 18.4594L9.58364 12.3211L15.7219 18.4594C16.1124 18.8499 16.7456 18.8499 17.1361 18.4594L18.4599 17.1356C18.8504 16.7451 18.8504 16.1119 18.4599 15.7214L12.3216 9.58315L18.4599 3.44488Z"
								fill="#323A46"
							/>
						</svg>
					</button>
				</div>
				<div className={classes.box}>
					<h1 className={classes.message}>In Progress 🕜</h1>
					<div className={classes.msgbox}>
						<p>Fetching your score ...</p>

						<div className={classes.line}></div>
					</div>
				</div>
			</ModelOverlay>
		</Fragment>
	);
};

export default Process;
