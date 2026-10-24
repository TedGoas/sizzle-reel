import { ref } from "vue";
import * as d3 from "d3";

/**
 * Composable for managing D3-based timeseries chart rendering
 * @param {Object} options - Configuration options
 * @param {Object} options.dataConfigs - Reactive data configurations
 * @param {Object} options.selectedTab - Reactive selected tab
 * @param {Object} options.tabs - Reactive tabs array
 * @param {Object} options.seriesVisibility - Reactive series visibility state
 * @param {Function} options.emit - Emit function for events
 * @returns {Object} Chart refs, tooltip state, and render function
 */
export function useTimeseriesChart({
	dataConfigs,
	selectedTab,
	tabs,
	seriesVisibility,
	emit,
}) {
	const timeseriesChart = ref(null);
	const tooltip = ref(null);
	const isTooltipHovered = ref(false);
	const isInitialRender = ref(true);

	// Tooltip reactive data
	const tooltipData = ref({
		visible: false,
		pinned: false,
		showButton: false,
		x: 0,
		y: 0,
		offsetLeft: false,
		date: "",
		metricLabel: "",
		rate: "",
		total: 0,
		negative: 0,
		positive: 0,
		negativeLabel: "",
		positiveLabel: "",
	});

	/**
	 * Handle mouse enter on tooltip (keeps it visible)
	 */
	function handleTooltipMouseEnter() {
		isTooltipHovered.value = true;
	}

	/**
	 * Handle mouse leave on tooltip (hides it only if not pinned)
	 */
	function handleTooltipMouseLeave() {
		isTooltipHovered.value = false;
		if (!tooltipData.value.pinned) {
			tooltipData.value.visible = false;
		}
	}

	/**
	 * Handle click on "View details" button in tooltip
	 */
	function handleViewDetails() {
		const filters = {
			date: tooltipData.value.date,
			outcome: null,
			resolution: null,
			skill: null,
			hasErrors: null,
		};

		// Map metric types to appropriate filters
		if (selectedTab.value === "containment") {
			filters.outcome = "Escalated";
		} else if (selectedTab.value === "resolution") {
			filters.resolution = "Unresolved";
		} else if (selectedTab.value === "skillSuccess") {
			filters.hasErrors = true;
		}

		emit("navigate-to-history", filters);
		tooltipData.value.visible = false;
		tooltipData.value.pinned = false;
	}

	/**
	 * Main chart rendering function using D3
	 * Renders stacked bar chart with line overlay showing rates
	 */
	function renderChart() {
		if (!timeseriesChart.value) {
			console.error("Timeseries chart ref not found!");
			return;
		}

		try {
			const config = dataConfigs.value[selectedTab.value];
			const data = config.data;
			const lineColor = config.lineColor;

			// Get computed styles for text color
			const styles = getComputedStyle(document.documentElement);
			const labelColor =
				styles.getPropertyValue("--dt-color-foreground-secondary").trim() ||
				"#6B7280";
			const borderColor =
				styles.getPropertyValue("--dt-color-border-subtle").trim() || "#E5E7EB";

			// Set dimensions
			const container = timeseriesChart.value.parentElement;
			const containerWidth = container.clientWidth || 600;
			const containerHeight = container.clientHeight || 400;
			const margin = { top: 20, right: 20, bottom: 50, left: 50 };
			const width = containerWidth - margin.left - margin.right;
			const height = containerHeight - margin.top - margin.bottom;

			// Select or create SVG
			let svgSelection = d3.select(timeseriesChart.value);

			// On initial render, clear and create new structure
			if (isInitialRender.value) {
				svgSelection.selectAll("*").remove();
			}

			svgSelection
				.attr("width", containerWidth)
				.attr("height", containerHeight);

			// Select or create main group
			let svg = svgSelection.select("g.main-group");
			if (svg.empty()) {
				svg = svgSelection
					.append("g")
					.attr("class", "main-group")
					.attr("transform", `translate(${margin.left},${margin.top})`);
			}

			// Create scales - use single axis for containment rate
			const x = d3
				.scaleBand()
				.domain(data.map((d) => d.day))
				.range([0, width])
				.padding(0.3);

			const y = d3.scaleLinear().domain([0, 100]).range([height, 0]);

			// Scale bars to fit nicely in the chart (proportional to max total)
			const maxTotal = d3.max(data, (d) => d.total);
			const barScale = d3
				.scaleLinear()
				.domain([0, maxTotal])
				.range([0, height * 0.8]); // Use 80% of height for bars

			// Add or update horizontal gridlines (only on initial render)
			if (isInitialRender.value) {
				const gridValues = [0, 50, 100];
				svg
					.selectAll(".gridline")
					.data(gridValues)
					.enter()
					.append("line")
					.attr("class", "gridline")
					.attr("x1", 0)
					.attr("x2", width)
					.attr("y1", (d) => y(d))
					.attr("y2", (d) => y(d))
					.attr("stroke", borderColor)
					.attr("stroke-width", 1);

				// Add y-axis with labels
				const yAxis = svg
					.append("g")
					.attr("class", "y-axis")
					.call(
						d3
							.axisLeft(y)
							.tickValues(gridValues)
							.tickSize(0)
							.tickPadding(10)
							.tickFormat((d) => `${d}%`),
					);

				// Hide y-axis domain line
				yAxis.select(".domain").remove();

				// Style y-axis text
				yAxis
					.selectAll("text")
					.style("font-size", "12px")
					.style("fill", labelColor)
					.style(
						"font-family",
						"'SF Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
					);
			}

			// Stack the bar data
			const stack = d3
				.stack()
				.keys(config.series)
				.order(d3.stackOrderNone)
				.offset(d3.stackOffsetNone);

			const stackedData = stack(data);

			// Normalize keys for consistent transitions across tabs
			const normalizedStackedData = stackedData.map((series, index) => {
				const normalized = series.map((d) => ({ ...d }));
				normalized.key = `series${index}`;
				normalized.originalKey = series.key;
				return normalized;
			});

			// Get current visibility state
			const visibility = seriesVisibility.value[selectedTab.value];

			// Update stacked bars (using barScale for proportional sizing)
			const barGroups = svg
				.selectAll(".bar-group")
				.data(normalizedStackedData, (d) => d.key);

			// Remove old bar groups that no longer exist
			barGroups.exit().remove();

			// Enter new bar groups
			const barGroupsEnter = barGroups
				.enter()
				.append("g")
				.attr("class", "bar-group")
				.attr("fill", (d) => config.colors[d.originalKey])
				.style("opacity", (d) => (visibility[d.originalKey] ? 1 : 0));

			// Update existing bar groups (color and opacity)
			barGroupsEnter
				.merge(barGroups)
				.transition()
				.duration(isInitialRender.value ? 0 : 600)
				.ease(d3.easeCubicInOut)
				.attr("fill", (d) => config.colors[d.originalKey])
				.style("opacity", (d) => (visibility[d.originalKey] ? 1 : 0));

			// Gap between stacked segments
			const segmentGap = 2;

			// Bind rect data to each group (reselect to get updated groups)
			const bars = svg
				.selectAll(".bar-group")
				.selectAll("rect")
				.data(
					(d) => d,
					(d) => d.data.day,
				);

			// Remove old bars
			bars.exit().remove();

			// Enter new bars
			const barsEnter = bars
				.enter()
				.append("rect")
				.attr("class", "bar")
				.attr("x", (d) => x(d.data.day))
				.attr(
					"y",
					isInitialRender.value
						? height
						: (d) => {
								const baseY = height - barScale(d[1]);
								// Add gap for non-bottom segments
								return d[0] > 0 ? baseY - segmentGap : baseY;
						  },
				)
				.attr(
					"height",
					isInitialRender.value
						? 0
						: (d) => {
								const baseHeight = barScale(d[1]) - barScale(d[0]);
								// Reduce height by gap for non-bottom segments
								return d[0] > 0 ? baseHeight - segmentGap : baseHeight;
						  },
				)
				.attr("width", x.bandwidth())
				.attr("rx", 2);

			// Update all bars (both new and existing)
			barsEnter
				.merge(bars)
				.transition()
				.duration(isInitialRender.value ? 600 : 600)
				.ease(d3.easeCubicInOut)
				.delay((d, i) => (isInitialRender.value ? i * 30 : 0))
				.attr("x", (d) => x(d.data.day))
				.attr("y", (d) => {
					const baseY = height - barScale(d[1]);
					// Add gap for non-bottom segments
					return d[0] > 0 ? baseY - segmentGap : baseY;
				})
				.attr("height", (d) => {
					const baseHeight = barScale(d[1]) - barScale(d[0]);
					// Reduce height by gap for non-bottom segments
					return d[0] > 0 ? baseHeight - segmentGap : baseHeight;
				})
				.attr("width", x.bandwidth());

			// Update line for rate (if visible)
			const rateVisible = visibility.rate !== false;
			if (rateVisible) {
				const line = d3
					.line()
					.x((d) => x(d.day) + x.bandwidth() / 2)
					.y((d) => y(d.rate))
					.curve(d3.curveMonotoneX);

				// Select or create line path
				let linePath = svg.select("path.rate-line");

				if (linePath.empty()) {
					// Create new line on first render
					linePath = svg
						.append("path")
						.datum(data)
						.attr("class", "rate-line")
						.attr("fill", "none")
						.attr("stroke", lineColor)
						.attr("stroke-width", 2)
						.attr("d", line);

					// Animate line drawing on initial render
					if (isInitialRender.value) {
						const lineLength = linePath.node().getTotalLength();
						linePath
							.attr("stroke-dasharray", lineLength + " " + lineLength)
							.attr("stroke-dashoffset", lineLength)
							.transition()
							.duration(800)
							.ease(d3.easeCubicInOut)
							.attr("stroke-dashoffset", 0);
					}
				} else {
					// Update existing line with transition
					linePath
						.datum(data)
						.transition()
						.duration(600)
						.ease(d3.easeCubicInOut)
						.attr("stroke", lineColor)
						.attr("d", line);
				}

				// Update dots on the line
				const dots = svg.selectAll(".dot").data(data, (d) => d.day);

				// Enter new dots
				const dotsEnter = dots
					.enter()
					.append("circle")
					.attr("class", "dot")
					.attr("cx", (d) => x(d.day) + x.bandwidth() / 2)
					.attr("cy", (d) => y(d.rate))
					.attr("r", isInitialRender.value ? 0 : 4)
					.attr("fill", lineColor);

				// Update existing + new dots
				dotsEnter
					.merge(dots)
					.transition()
					.duration(isInitialRender.value ? 300 : 600)
					.ease(d3.easeCubicInOut)
					.delay((d, i) => (isInitialRender.value ? 400 + i * 50 : 0))
					.attr("cx", (d) => x(d.day) + x.bandwidth() / 2)
					.attr("cy", (d) => y(d.rate))
					.attr("r", 4)
					.attr("fill", lineColor);

				// Remove old dots
				dots.exit().remove();
			} else {
				// Hide line and dots if not visible
				svg.select("path.rate-line").style("opacity", 0);
				svg.selectAll(".dot").style("opacity", 0);
			}

			// Create hover zone event handlers
			const handleMouseEnter = function (_event, d) {
				// Reduce opacity of all bars
				svg.selectAll(".bar").style("opacity", 0.3);

				// Restore opacity for the hovered day's bars
				svg
					.selectAll(".bar")
					.filter((barData) => barData.data.day === d.day)
					.style("opacity", 1);

				// Format date
				const dayIndex = data.findIndex((item) => item.day === d.day);
				const date = new Date();
				date.setDate(date.getDate() - (6 - dayIndex));
				const formattedDate = date.toLocaleDateString("en-US", {
					month: "short",
					day: "numeric",
					year: "numeric",
				});

				// Get current tab label
				const currentTab = tabs.value.find(
					(tab) => tab.id === selectedTab.value,
				);

				// Get series values from data
				const series1Key = config.series[0];
				const series2Key = config.series[1];

				// Calculate absolute position relative to viewport
				const chartRect = timeseriesChart.value.getBoundingClientRect();
				const barCenterX = x(d.day) + x.bandwidth() / 2;

				// Tooltip dimensions (approximate)
				const tooltipWidth = 220;
				const horizontalOffset = 40; // Offset from bar center

				// Determine if we should offset tooltip left or right
				// If bar is in right half of chart, offset left; otherwise offset right
				const offsetLeft = barCenterX > width / 2;

				let absoluteX;
				if (offsetLeft) {
					// Offset to the left and align right edge
					absoluteX =
						chartRect.left + margin.left + barCenterX - horizontalOffset;
				} else {
					// Offset to the right and align left edge
					absoluteX =
						chartRect.left + margin.left + barCenterX + horizontalOffset;
				}

				// Position tooltip above the chart
				const absoluteY = chartRect.top + margin.top - 10;

				// Only update tooltip if not already pinned
				if (!tooltipData.value.pinned) {
					// Update tooltip data - show preview without button
					tooltipData.value = {
						visible: true,
						pinned: false,
						showButton: false,
						x: absoluteX,
						y: absoluteY,
						offsetLeft: offsetLeft,
						date: formattedDate,
						metricLabel: currentTab.label,
						rate: `${d.rate.toFixed(1)}%`,
						total: d.total,
						negative: d[series2Key],
						positive: d[series1Key],
						negativeLabel: config.labels[series2Key],
						positiveLabel: config.labels[series1Key],
					};
				}
			};

			const handleMouseLeave = function () {
				// Restore opacity for all bars
				svg.selectAll(".bar").style("opacity", 1);

				// Only hide tooltip if not pinned
				if (!tooltipData.value.pinned) {
					setTimeout(() => {
						if (!isTooltipHovered.value && !tooltipData.value.pinned) {
							tooltipData.value.visible = false;
						}
					}, 150);
				}
			};

			const handleBarClick = function (_event, d) {
				// Format date for comparison
				const dayIndex = data.findIndex((item) => item.day === d.day);
				const date = new Date();
				date.setDate(date.getDate() - (6 - dayIndex));
				const formattedDate = date.toLocaleDateString("en-US", {
					month: "short",
					day: "numeric",
					year: "numeric",
				});

				// If clicking same bar that's already showing, toggle pin
				if (
					tooltipData.value.visible &&
					tooltipData.value.date === formattedDate
				) {
					tooltipData.value.pinned = !tooltipData.value.pinned;
					tooltipData.value.showButton = tooltipData.value.pinned;
				} else {
					// Show and pin new tooltip
					handleMouseEnter(_event, d);
					tooltipData.value.pinned = true;
					tooltipData.value.showButton = true;
				}
			};

			// Update invisible hover zones for better interaction
			const hoverZones = svg.selectAll(".hover-zone").data(data, (d) => d.day);

			// Enter new hover zones
			hoverZones
				.enter()
				.append("rect")
				.attr("class", "hover-zone")
				.attr("x", (d) => x(d.day))
				.attr("y", 0)
				.attr("width", x.bandwidth())
				.attr("height", height)
				.attr("fill", "transparent")
				.attr("cursor", "pointer")
				.on("mouseenter", handleMouseEnter)
				.on("mouseleave", handleMouseLeave)
				.on("click", handleBarClick);

			// Update existing hover zones
			hoverZones
				.on("mouseenter", handleMouseEnter)
				.on("mouseleave", handleMouseLeave)
				.on("click", handleBarClick);

			// Remove old hover zones
			hoverZones.exit().remove();

			// Add or update x-axis (only on initial render)
			if (isInitialRender.value) {
				const xAxis = svg
					.append("g")
					.attr("class", "x-axis")
					.attr("transform", `translate(0,${height})`)
					.call(d3.axisBottom(x).tickSize(0).tickPadding(10));

				// Style x-axis domain line
				xAxis.select(".domain").attr("stroke", borderColor);

				// Style x-axis text
				xAxis
					.selectAll("text")
					.style("font-size", "12px")
					.style("fill", labelColor)
					.style(
						"font-family",
						"'SF Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
					);
			}
		} catch (error) {
			console.error("Error creating timeseries chart:", error);
		}
	}

	/**
	 * Reset the initial render flag (called after first render or tab change)
	 */
	function setInitialRenderComplete() {
		isInitialRender.value = false;
	}

	return {
		timeseriesChart,
		tooltip,
		tooltipData,
		isTooltipHovered,
		isInitialRender,
		renderChart,
		setInitialRenderComplete,
		handleTooltipMouseEnter,
		handleTooltipMouseLeave,
		handleViewDetails,
	};
}
