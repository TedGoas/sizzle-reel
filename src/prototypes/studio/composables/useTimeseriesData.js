import { computed } from "vue";

/**
 * Composable for managing timeseries chart data generation and configuration
 * @param {Object} props - Component props containing dateRange
 * @returns {Object} Data configs and helper functions
 */
export function useTimeseriesData(props) {
	/**
	 * Generate mock data based on date range and metric type
	 * @param {string} dateRange - The date range to generate data for
	 * @param {string} metric - The metric type (containment, resolution, skillSuccess)
	 * @returns {Array} Array of data points with day labels and metric values
	 */
	function generateMockData(dateRange, metric) {
		// Base rates for each metric (used for consistency)
		const baseRates = {
			containment: { positive: 0.8, negative: 0.2 },
			resolution: { positive: 0.87, negative: 0.13 },
			skillSuccess: { positive: 0.9, negative: 0.1 },
		};

		// Series keys based on metric
		const seriesConfig = {
			containment: { positive: "contained", negative: "transferred" },
			resolution: { positive: "resolved", negative: "unresolved" },
			skillSuccess: { positive: "noErrors", negative: "withErrors" },
		};

		const series = seriesConfig[metric];
		const rates = baseRates[metric];

		// Generate data points with some randomness
		function generatePoint(baseTotal, dayLabel, dayIndex) {
			const variance = 0.15; // 15% variance
			const total = Math.round(
				baseTotal * (1 + (Math.random() - 0.5) * variance),
			);
			const positiveValue = Math.round(
				total * (rates.positive + (Math.random() - 0.5) * 0.1),
			);
			const negativeValue = total - positiveValue;

			return {
				day: dayLabel,
				[series.positive]: positiveValue,
				[series.negative]: negativeValue,
				dayIndex,
			};
		}

		let data = [];

		switch (dateRange) {
			case "today":
				data = [generatePoint(250, "Today", 0)];
				break;

			case "thisWeek": {
				const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
				const today = new Date().getDay();
				for (let i = 0; i <= today; i++) {
					data.push(generatePoint(220, dayNames[i], i));
				}
				break;
			}

			case "thisMonth": {
				const today = new Date();
				const daysInMonth = today.getDate();
				for (let i = 0; i < daysInMonth; i++) {
					const date = new Date(today.getFullYear(), today.getMonth(), i + 1);
					const label = `${date.getMonth() + 1}/${date.getDate()}`;
					data.push(generatePoint(220, label, i));
				}
				break;
			}

			case "past7days":
			default: {
				const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
				dayNames.forEach((day, i) => {
					data.push(generatePoint(220, day, i));
				});
				break;
			}

			case "past15days": {
				for (let i = 0; i < 15; i++) {
					const date = new Date();
					date.setDate(date.getDate() - (14 - i));
					const label = `${date.getMonth() + 1}/${date.getDate()}`;
					data.push(generatePoint(220, label, i));
				}
				break;
			}

			case "past30days": {
				for (let i = 0; i < 30; i++) {
					const date = new Date();
					date.setDate(date.getDate() - (29 - i));
					const label = `${date.getMonth() + 1}/${date.getDate()}`;
					data.push(generatePoint(220, label, i));
				}
				break;
			}

			case "past90days": {
				// Weekly data (13 weeks)
				for (let i = 0; i < 13; i++) {
					const date = new Date();
					date.setDate(date.getDate() - (12 - i) * 7);
					const label = `${date.getMonth() + 1}/${date.getDate()}`;
					// Weekly totals should be ~7x daily average
					data.push(generatePoint(1540, label, i));
				}
				break;
			}
		}

		return data;
	}

	/**
	 * Calculate overall rate for a metric configuration
	 * @param {Object} config - Configuration object with data and series
	 * @returns {string} Formatted percentage rate
	 */
	function calculateOverallRate(config) {
		const series1Total = config.data.reduce(
			(sum, d) => sum + d[config.series[0]],
			0,
		);
		const series2Total = config.data.reduce(
			(sum, d) => sum + d[config.series[1]],
			0,
		);
		const total = series1Total + series2Total;
		return ((series1Total / total) * 100).toFixed(1);
	}

	/**
	 * Computed data configurations for all metric types
	 * Generates mock data and provides metadata for each metric
	 */
	const dataConfigs = computed(() => {
		const containmentData = generateMockData(props.dateRange, "containment");
		const resolutionData = generateMockData(props.dateRange, "resolution");
		const skillSuccessData = generateMockData(props.dateRange, "skillSuccess");

		return {
			containment: {
				data: containmentData,
				series: ["contained", "transferred"],
				colors: {
					contained: "#CFDAF0",
					transferred: "#8AABDD",
				},
				lineColor: "#1C4D70",
				labels: {
					contained: "Contained",
					transferred: "Transferred",
				},
			},
			resolution: {
				data: resolutionData,
				series: ["resolved", "unresolved"],
				colors: {
					resolved: "#CFDAF0",
					unresolved: "#8AABDD",
				},
				lineColor: "#1C4D70",
				labels: {
					resolved: "Resolved",
					unresolved: "Unresolved",
				},
			},
			skillSuccess: {
				data: skillSuccessData,
				series: ["noErrors", "withErrors"],
				colors: {
					noErrors: "#CFDAF0",
					withErrors: "#8AABDD",
				},
				lineColor: "#1C4D70",
				labels: {
					noErrors: "No errors",
					withErrors: "With Errors",
				},
			},
		};
	});

	/**
	 * Computed tabs with dynamically calculated rates
	 * Enriches data with rate calculations for display
	 */
	const tabs = computed(() => {
		const configs = dataConfigs.value;

		// Calculate rates for all datasets
		Object.values(configs).forEach((config) => {
			config.data.forEach((d) => {
				const series1Value = d[config.series[0]];
				const series2Value = d[config.series[1]];
				const total = series1Value + series2Value;
				d.rate = (series1Value / total) * 100;
				d.total = total;
			});
		});

		return [
			{
				id: "containment",
				label: "Containment rate",
				rate: `${calculateOverallRate(configs.containment)}%`,
			},
			{
				id: "resolution",
				label: "Resolution rate",
				rate: `${calculateOverallRate(configs.resolution)}%`,
			},
			{
				id: "skillSuccess",
				label: "Skill success rate",
				rate: `${calculateOverallRate(configs.skillSuccess)}%`,
			},
		];
	});

	return {
		dataConfigs,
		tabs,
	};
}
