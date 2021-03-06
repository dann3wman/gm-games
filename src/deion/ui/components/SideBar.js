// @flow

import classNames from "classnames";
import PropTypes from "prop-types";
import React, { useCallback, useEffect, useRef, useState } from "react";
import type { Element, ElementRef } from "react";
import { emitter, helpers, menuItems, useLocalShallow } from "../util";

const getText = (text): string | Element<any> => {
	if (text.hasOwnProperty("side")) {
		// $FlowFixMe
		return text.side;
	}

	// $FlowFixMe
	return text;
};

const MenuGroup = ({ children }) => (
	<ul className="nav flex-column">{children}</ul>
);
MenuGroup.propTypes = {
	children: PropTypes.any.isRequired,
};

const MenuItem = ({
	godMode,
	lid,
	menuItem,
	onMenuItemClick,
	pageID,
	root,
}) => {
	if (!menuItem.league && lid !== undefined) {
		return null;
	}
	if (!menuItem.nonLeague && lid === undefined) {
		return null;
	}

	if (menuItem.type === "link") {
		if (menuItem.godMode && !godMode) {
			return null;
		}

		const anchorProps = {};
		if (typeof menuItem.path === "string") {
			anchorProps.href = menuItem.path;
			if (menuItem.path.startsWith("http")) {
				anchorProps.rel = "noopener noreferrer";
				anchorProps.target = "_blank";
			}
		} else if (Array.isArray(menuItem.path)) {
			anchorProps.href = helpers.leagueUrl(menuItem.path);
		}
		anchorProps.onClick = async e => {
			if (menuItem.onClick) {
				// Don't close menu if response is false
				const response = await menuItem.onClick(e);
				if (response !== false) {
					onMenuItemClick();
				}
			} else {
				onMenuItemClick();
			}
		};

		const item = (
			<li className="nav-item">
				<a
					className={classNames("nav-link", {
						active: menuItem.active ? menuItem.active(pageID) : false,
						"god-mode": menuItem.godMode,
					})}
					{...anchorProps}
				>
					{getText(menuItem.text)}
				</a>
			</li>
		);
		return root ? <MenuGroup>{item}</MenuGroup> : item;
	}

	if (menuItem.type === "header") {
		const children = menuItem.children
			.map((child, i) => (
				<MenuItem
					godMode={godMode}
					key={i}
					lid={lid}
					menuItem={child}
					onMenuItemClick={onMenuItemClick}
					pageID={pageID}
					root={false}
				/>
			))
			.filter(element => element !== null);
		if (children.length === 0) {
			return null;
		}

		return (
			<>
				<h6 className="sidebar-heading px-3">{menuItem.long}</h6>
				<MenuGroup>{children}</MenuGroup>
			</>
		);
	}

	throw new Error(`Unknown menuItem.type "${menuItem.type}"`);
};

type Props = {
	pageID?: string,
};

// Sidebar open/close state is done with the DOM directly rather than by passing a prop down or using local.getState()
// because then performance of the menu is independent of any other React performance issues - basically it's a hack to
// make menu performance consistent even if there are other problems. Like on the Fantasy Draft page.

// $FlowFixMe
const SideBar = React.memo(({ pageID }: Props) => {
	const [node, setNode] = useState<null | ElementRef<"div">>(null);
	const [nodeFade, setNodeFade] = useState<null | ElementRef<"div">>(null);

	const topUserBlockRef = useRef<HTMLElement | null>(null);

	const getNode = useCallback(node2 => {
		if (node2 !== null) {
			setNode(node2);
		}
	}, []);

	const getNodeFade = useCallback(node2 => {
		if (node2 !== null) {
			setNodeFade(node2);
		}
	}, []);

	const close = useCallback(() => {
		// These are flat conditions while open is nested, by design - clean up everything!
		if (node) {
			node.classList.remove("sidebar-open");
		}
		if (nodeFade) {
			nodeFade.classList.add("sidebar-fade-closing");
		}
		setTimeout(() => {
			if (nodeFade) {
				nodeFade.classList.remove("sidebar-fade-open");
			}
			if (nodeFade) {
				nodeFade.classList.remove("sidebar-fade-closing");
			}
			if (document.body) {
				document.body.classList.remove("modal-open");
			}
			if (document.body) {
				document.body.style.paddingRight = "";
				if (topUserBlockRef.current) {
					topUserBlockRef.current.style.paddingRight = "";
				}
			}
		}, 300); // Keep time in sync with .sidebar-fade
	}, [node, nodeFade]);

	const open = useCallback(() => {
		if (node) {
			node.classList.add("sidebar-open");
			if (nodeFade) {
				nodeFade.classList.add("sidebar-fade-open");

				if (document.body) {
					const scrollbarWidth = window.innerWidth - document.body.offsetWidth;
					if (document.body) {
						document.body.classList.add("modal-open");
					}
					if (document.body) {
						document.body.style.paddingRight = `${scrollbarWidth}px`;
						if (topUserBlockRef.current) {
							topUserBlockRef.current.style.paddingRight = `${scrollbarWidth}px`;
						}
					}
				}
			}
		}
	}, [node, nodeFade]);

	const toggle = useCallback(() => {
		if (node) {
			if (node.classList.contains("sidebar-open")) {
				close();
			} else {
				open();
			}
		}
	}, [close, node, open]);

	useEffect(() => {
		if (nodeFade) {
			nodeFade.addEventListener("click", close);
		}

		emitter.on("sidebar-toggle", toggle);

		return () => {
			if (nodeFade) {
				nodeFade.removeEventListener("click", close);
			}

			emitter.removeListener("sidebar-toggle", toggle);
		};
	}, [close, nodeFade, toggle]);

	useEffect(() => {
		topUserBlockRef.current = document.getElementById("top-user-block");
	}, []);

	const { godMode, lid } = useLocalShallow(state => ({
		godMode: state.godMode,
		lid: state.lid,
	}));

	return (
		<>
			<div ref={getNodeFade} className="sidebar-fade" />
			<div className="bg-light sidebar" id="sidebar" ref={getNode}>
				<div className="sidebar-sticky">
					{menuItems.map((menuItem, i) => (
						<MenuItem
							godMode={godMode}
							key={i}
							lid={lid}
							menuItem={menuItem}
							onMenuItemClick={close}
							pageID={pageID}
							root
						/>
					))}
				</div>
			</div>
		</>
	);
});

// $FlowFixMe
SideBar.propTypes = {
	pageID: PropTypes.string,
};

export default SideBar;
