import * as THREE from "three";
import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Preload, Image as ImageImpl } from "@react-three/drei";
import { ScrollControls, Scroll, useScroll } from "./ScrollControls";

function Image(props) {
	const ref = useRef();
	const group = useRef();
	const data = useScroll();
	useFrame((state, delta) => {
		group.current.position.z = THREE.MathUtils.damp(group.current.position.z, Math.max(0, data.delta * 50), 4, delta);
		ref.current.material.grayscale = THREE.MathUtils.damp(
			ref.current.material.grayscale,
			Math.max(0, 1 - data.delta * 1000),
			4,
			delta
		);
	});
	return (
		<group ref={group}>
			<ImageImpl ref={ref} {...props} />
		</group>
	);
}

function Page({ m = 0.4, urls, ...props }) {
	const { width } = useThree((state) => state.viewport);
	const w = width < 10 ? 1.5 / 3 : 1 / 3.5;
	return (
		<group {...props}>
			<Image position={[-width * w, 0, -1]} scale={[width * w - m * 2, 5, 1]} url={urls[0]} />
			<Image position={[0, 0, 0]} scale={[width * w - m * 2, 5, 1]} url={urls[1]} />
			<Image position={[width * w, 0, 1]} scale={[width * w - m * 2, 5, 1]} url={urls[2]} />
		</group>
	);
}

function Pages() {
	const { width } = useThree((state) => state.viewport);

	const pages = useMemo(() => {
		const images = [...Array(3 * 5).keys()].map((i) => `https://source.unsplash.com/random/800x600?sig=${i}`);
		const pages = images.reduce((acc, _, i) => {
			if (i % 3 === 0) acc.push(images.slice(i, i + 3));
			return acc;
		}, [] as string[][]);

		return pages;
	}, []);

	return (
		<>
			{pages.map((images, i) => (
				<Page key={i} position={[(-1 + i) * width, 0, 0]} urls={images} />
			))}
			<Page position={[(-1 + pages.length - 1) * width, 0, 0]} urls={pages[0]} />
		</>
	);
}

export const Gallery2 = () => {
	return (
		<Canvas gl={{ antialias: false }} dpr={[1, 1.5]}>
			<Suspense fallback={null}>
				<ScrollControls infinite horizontal damping={4} pages={4} distance={1}>
					<Scroll>
						<Pages />
					</Scroll>
					<Scroll html>
						<h1 className="text-[120px] font-semibold absolute top-[20vh] left-[(-75vw)]">creativity</h1>
						<h1 className="text-[120px] font-semibold absolute top-[20vh] left-[25vw]">beyond</h1>
						<h1 className="text-[120px] font-semibold absolute top-[20vh] left-[125vw]">imagination</h1>
						<h1 className="text-[120px] font-semibold absolute top-[20vh] left-[225vw]">creativity</h1>
						<h1 className="text-[120px] font-semibold absolute top-[20vh] left-[325vw]">beyond</h1>
						<h1 className="text-[120px] font-semibold absolute top-[20vh] left-[425vw]">imagination</h1>
					</Scroll>
				</ScrollControls>
				<Preload />
			</Suspense>
		</Canvas>
	);
};
