import styles from './styles/index.module.scss'
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import UnityGame from './Pages/UnityGame/UnityGame';


function App() {
	return (
				<Router>
					<div className={styles.app}>
						<Routes>
							<Route path="/" element={<UnityGame/>} />
						</Routes>
					</div>
				</Router>
	);
}

export default App;
