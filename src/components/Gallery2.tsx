import { Image as ImageImpl, Preload } from "@react-three/drei";
import { Canvas, useFrame, useThree, type GroupProps } from "@react-three/fiber";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { Scroll, ScrollControls, useScroll } from "./ScrollControls";
import { useSpring, animated } from "@react-spring/three";
import { galleryItems } from "../lib/constants";
import { aggregateResult, preloadImages } from "../lib/utils";

interface ImageProps extends GroupProps {
	url: string;
}

const Image = ({ ...props }: ImageProps) => {
	const ref = useRef();
	const group = useRef<GroupProps>();
	const data = useScroll();

	const [hovered, setHovered] = useState(false);

	const initialRotation = useMemo(() => {
		return [THREE.MathUtils.degToRad(0), THREE.MathUtils.degToRad(0), THREE.MathUtils.degToRad(Math.random() * 12 - 6)];
	}, []);

	const { scale, rotation } = useSpring({
		scale: hovered ? 1.1 : 1,
		rotation: hovered ? [0, 0, 0] : initialRotation,
	});

	useFrame((state, delta) => {
		group.current.position.z = THREE.MathUtils.damp(group.current.position.z, Math.max(0, data.delta * 50), 4, delta);
	});

	useEffect(() => {
		document.body.style.cursor = hovered ? "pointer" : "auto";
	}, [hovered]);

	return (
		<animated.group
			ref={group}
			scale={scale}
			rotation={rotation}
			onPointerEnter={() => setHovered(true)}
			onPointerLeave={() => setHovered(false)}>
			<ImageImpl ref={ref} {...props} />
		</animated.group>
	);
};

interface PageProps extends GroupProps {
	m?: number;
	urls: string[];
}

const Page = ({ m = 0.4, urls, ...props }: PageProps) => {
	const { width } = useThree((state) => state.viewport);
	const w = width < 10 ? 1.5 / 3 : 1 / 3.5;

	return (
		<group {...props}>
			<Image position={[-width * w, 0, -1]} scale={[width * w - m * 2, 5, 1]} url={urls[0]} />
			<Image position={[0, 0, 0]} scale={[width * w - m * 2, 5, 1]} url={urls[1]} />
			<Image position={[width * w, 0, 1]} scale={[width * w - m * 2, 5, 1]} url={urls[2]} />
		</group>
	);
};

function Pages() {
	const { width } = useThree((state) => state.viewport);

	const pages = useMemo(() => {
		const images = galleryItems.slice(0, 9).map((item) => item.imageUrl);
		// const images = [...Array(3 * 5).keys()].map((i) => `https://source.unsplash.com/random/800x600?sig=${i}`);
		const pages = images.reduce(
			(acc, _, i) => {
				if (i % 3 === 0)
					acc.push({
						urls: images.slice(i, i + 3),
						position: [(-1 + i / 3) * width, 0, 0],
					});

				return acc;
			},
			[] as {
				urls: string[];
				position: [number, number, number];
			}[]
		);

		return pages;
	}, []);

	return (
		<>
			{pages.map((page, i) => (
				<Page key={i} position={page.position} urls={page.urls} />
			))}
			<Page position={[(pages.length - 1) * width, 0, 0]} urls={pages[0].urls} />
		</>
	);
}

const headingClassName = "text-[120px] font-semibold absolute text-zinc-600";

export const Gallery2 = () => {
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		preloadImages(galleryItems.slice(0, 9).map((item) => item.imageUrl)).then((result) => {
			console.log(aggregateResult(result));
			setLoading(false);
		});
	}, []);

	return (
		<>
			{loading && <span className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-xl">Loading</span>}
			{!loading && (
				<Canvas gl={{ antialias: false }} dpr={[1, 1.5]}>
					<Suspense fallback={null}>
						<ScrollControls infinite horizontal damping={4} pages={4} distance={1}>
							<Scroll>
								<Pages />
							</Scroll>
							<Scroll html>
								<h1 className={`${headingClassName} top-[20vh] left-[(-75vw)]`}>creativity</h1>
								<h1 className={`${headingClassName} top-[20vh] left-[25vw]`}>beyond</h1>
								<h1 className={`${headingClassName} top-[20vh] left-[125vw]`}>imagination</h1>
								<h1 className={`${headingClassName} top-[20vh] left-[225vw]`}>creativity</h1>
								<h1 className={`${headingClassName} top-[20vh] left-[325vw]`}>beyond</h1>
								<h1 className={`${headingClassName} top-[20vh] left-[425vw]`}>imagination</h1>
							</Scroll>
						</ScrollControls>
						<Preload />
					</Suspense>
				</Canvas>
			)}
		</>
	);
};
