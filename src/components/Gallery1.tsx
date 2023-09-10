import { useRef, useState, type MouseEvent, type ReactNode } from "react";

const images = [...Array(36)].map((_, i) => `https://source.unsplash.com/random/800x600?sig=${i}`);

function ShiftOnHover({ children }: { children: ReactNode }) {
	const containerRef = useRef<HTMLDivElement>(null);
	const [transform, setTransform] = useState({ transform: "translate(0, 0)" });

	const handleMouseMove = (e: MouseEvent<HTMLDivElement, MouseEvent<Element, MouseEvent>>) => {
		const container = containerRef.current as HTMLDivElement;
		const containerRect = container.getBoundingClientRect();

		const mouseX = e.clientX - containerRect.left - containerRect.width / 2;
		const mouseY = e.clientY - containerRect.top - containerRect.height / 2;

		const newTransform = `translate(${mouseX / 2}px, ${mouseY / 2}px)`;
		setTransform({ transform: newTransform });
	};

	const handleMouseLeave = () => {
		setTransform({ transform: "translate(0, 0)" });
	};

	return (
		<div
			ref={containerRef}
			style={{
				position: "relative",
				transformOrigin: "center",
				transition: "transform 0.2s ease",
				...transform,
			}}
			onMouseMove={handleMouseMove}
			onMouseLeave={handleMouseLeave}>
			{children}
		</div>
	);
}

export default function Gallery1() {
	return (
		<div
			className="w-screen h-screen relative overflow-hidden"
			style={{
				boxShadow: "inset 0 0 20px rgba(250, 250, 250, 0.5)",
			}}>
			<div className="absolute inset-0">
				<ShiftOnHover>
					<div className="h-[1400px] w-[2000px] grid gap-32 grid-cols-6 grid-rows-6">
						{images.map((image, i) => (
							<div className="flex transition-all cursor-pointer duration-300  grayscale hover:grayscale-0 gap-3 group hover:scale-125 hover:rotate-3">
								<div key={i} className="relative w-[128px] h-[200px]">
									<img src={image} alt="" className="absolute inset-0 w-full h-full object-cover" />
								</div>
								<div className="group-hover:opacity-100 opacity-0">
									<h2 className="uppercase text-lg mb-1">title</h2>
									<p className="text-sm mb-4">description</p>
									<span className="text-sm font-bold">$PRICE</span>
								</div>
							</div>
						))}
					</div>
				</ShiftOnHover>
			</div>
		</div>
	);
}
