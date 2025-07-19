/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { Unity, useUnityContext } from 'react-unity-webgl';
import styles from './unityGame.module.scss'
import { useRef } from 'react';

export default function UnityGame() {
	const [devicePixelRatio, setDevicePixelRatio] = useState(
		window.devicePixelRatio
	);
	const containerRef = useRef(null);

	function isMobileDevice() {
		return /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
			navigator.userAgent
		);
	}

	useEffect(
		function () {
			const updateDevicePixelRatio = function () {
				setDevicePixelRatio(window.devicePixelRatio);
			};
			const mediaMatcher = window.matchMedia(
				`screen and (resolution: ${devicePixelRatio}dppx)`
			);
			mediaMatcher.addEventListener('change', updateDevicePixelRatio);
			return function () {
				mediaMatcher.removeEventListener(
					'change',
					updateDevicePixelRatio
				);
			};
		},
		[devicePixelRatio]
	);

	const renderLoading = () => (
		<div className={styles.loadingScreen}>
			<div className={styles.loadingContent}>
				<img
					src="/cm.png"
					alt="Logo"
					className={styles.loadingLogo}
				/>
				<div className={styles.loadingBarContainer}>
					<div
						className={styles.loadingBar}
						style={{ width: `${loadingProgression * 100}%` }}
					/>
				</div>
			</div>
		</div>
	);

	const { unityProvider, isLoaded, loadingProgression, sendMessage } =
		useUnityContext({
			loaderUrl: '/unity-build/Build/tamaluco.loader.js',
			dataUrl: '/unity-build/Build/tamaluco.data.unityweb',
			frameworkUrl: '/unity-build/Build/tamaluco.framework.js.unityweb',
			codeUrl: '/unity-build/Build/tamaluco.wasm.unityweb',
		});

	//! Start FullScreen Functions
	const enterFullscreen = () => {
		if (!isMobileDevice()) return;

		const elem = document.documentElement;

		if (elem.requestFullscreen) {
			elem.requestFullscreen();
		} else if (elem.webkitRequestFullscreen) {
			// Safari
			elem.webkitRequestFullscreen();
		} else if (elem.msRequestFullscreen) {
			// IE11
			elem.msRequestFullscreen();
		}
	};

	const fixIOSFullscreen = () => {
		document.documentElement.style.setProperty(
			'--vh',
			`${window.innerHeight * 0.01}px`
		);
		document.body.style.height = `${window.innerHeight}px`;
	};

	useEffect(() => {
		document.addEventListener('click', enterFullscreen);
		document.addEventListener('touchstart', enterFullscreen);
		window.addEventListener('resize', fixIOSFullscreen);
		window.addEventListener('load', fixIOSFullscreen);
		return () => {
			document.removeEventListener('click', enterFullscreen);
			document.removeEventListener('touchstart', enterFullscreen);
			window.removeEventListener('resize', fixIOSFullscreen);
			window.removeEventListener('load', fixIOSFullscreen);
		};
	}, []);

	//! End FullScreen Functions

	return (
		<div ref={containerRef} className={styles.container}>
			{!isLoaded && renderLoading()}
			<Unity
				className={styles.unityGame}
				unityProvider={unityProvider}
				devicePixelRatio={devicePixelRatio}
			/>
		</div>
	);
}
