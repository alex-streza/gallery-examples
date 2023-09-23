import { CameraControls, Gltf, MeshPortalMaterial, Text, useCursor } from "@react-three/drei";
import { Canvas, extend, useFrame, useThree } from "@react-three/fiber";
import { easing, geometry } from "maath";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { useLocation, useRoute } from "wouter";

extend(geometry);

export const PortalGallery = () => {
	const [, params] = useRoute("/item/:id");
	const [, setLocation] = useLocation();

	return (
		<>
			<a className="absolute z-50 bottom-12 left-20" href="#" onClick={() => setLocation("/")}>
				{params ? "< back" : "double click to enter portal"}
			</a>
			<Canvas
				camera={{ fov: 75, position: [0, 0, 20] }}
				eventSource={document.getElementById("root")}
				eventPrefix="client">
				<color attach="background" args={["#f0f0f0"]} />
				<Frame id="01" name={`Astral`} price="$1200" bg="#e4cdac" position={[-1.15, 0, 0]} rotation={[0, 0.5, 0]}>
					<Gltf
						src="pickles_3d_version_of_hyuna_lees_illustration-transformed.glb"
						scale={8}
						position={[0, -0.7, -2]}
					/>
				</Frame>
				<Frame id="02" name="Table" price="$1500">
					<Gltf src="fiesta_tea-transformed.glb" position={[0, -2, -3]} />
				</Frame>
				<Frame id="03" name="Mineral" price="$2000" bg="#d1d1ca" position={[1.15, 0, 0]} rotation={[0, -0.5, 0]}>
					<Gltf src="still_life_based_on_heathers_artwork-transformed.glb" scale={2} position={[0, -0.8, -4]} />
				</Frame>
				<Rig />
			</Canvas>
		</>
	);
};

function Frame({ id, name, price, bg, width = 1, height = 1.61803398875, children, ...props }) {
	const portal = useRef();
	const [, setLocation] = useLocation();
	const [, params] = useRoute("/item/:id");
	const [hovered, hover] = useState(false);
	useCursor(hovered);
	useFrame((state, dt) => easing.damp(portal.current, "blend", params?.id === id ? 1 : 0, 0.2, dt));
	return (
		<group {...props}>
			<Text
				fontSize={0.24}
				anchorY="top"
				anchorX="left"
				lineHeight={0.8}
				position={[-0.44, 0.715, 0.01]}
				material-toneMapped={false}>
				{name}
			</Text>
			<Text fontSize={0.1} anchorX="right" position={[0.4, -0.659, 0.01]} material-toneMapped={false}>
				/{id}
			</Text>
			<Text fontSize={0.08} anchorX="right" position={[-0.2, -0.659, 0.01]} material-toneMapped={false}>
				{price}
			</Text>
			<mesh
				name={id}
				onDoubleClick={(e) => (e.stopPropagation(), setLocation("/item/" + e.object.name))}
				onPointerOver={(e) => hover(true)}
				onPointerOut={() => hover(false)}>
				<roundedPlaneGeometry args={[width, height, 0.1]} />
				<MeshPortalMaterial ref={portal} events={params?.id === id} side={THREE.DoubleSide}>
					<color attach="background" args={[bg]} />
					{children}
				</MeshPortalMaterial>
			</mesh>
		</group>
	);
}

function Rig({ position = new THREE.Vector3(0, 0, 2), focus = new THREE.Vector3(0, 0, 0) }) {
	const { controls, scene } = useThree();
	const [, params] = useRoute("/item/:id");
	useEffect(() => {
		const active = scene.getObjectByName(params?.id);
		if (active) {
			active.parent.localToWorld(position.set(0, 0.5, 0.25));
			active.parent.localToWorld(focus.set(0, 0, -2));
		}
		controls?.setLookAt(...position.toArray(), ...focus.toArray(), true);
	});
	return <CameraControls makeDefault minPolarAngle={0} maxPolarAngle={Math.PI / 2} />;
}
