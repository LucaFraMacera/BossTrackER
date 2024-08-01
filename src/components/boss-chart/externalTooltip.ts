import styles from "@/components/boss-chart/boss-chart.module.css"
import {Chart, ChartConfiguration, ScriptableChartContext, TooltipModel} from "chart.js";
import {ChartDataValue} from "@/lib/charts/chart.model";

const getOrCreateTooltip = (chart:Chart) => {
    if(!chart || !(chart.canvas) || !(chart.canvas.parentNode)){
        return
    }
    let tooltipEl = chart.canvas.parentNode.querySelector('.'+styles.tooltipBox);

    if (!tooltipEl) {
        tooltipEl = document.createElement('div');
        const title = document.createElement('label');
        const content = document.createElement('div')
        tooltipEl.className = styles.tooltipBox
        title.className = styles.tooltipTitle
        content.className = styles.tooltipContent
        tooltipEl.appendChild(title);
        tooltipEl.appendChild(content)
        chart.canvas.parentNode.appendChild(tooltipEl);
    }

    return tooltipEl as HTMLElement;
};

export const externalTooltipHandler = (context:any) => {
    const {chart, tooltip} = context;
    const tooltipEl = getOrCreateTooltip(chart);

    if(!tooltipEl){
        return;
    }

    if (tooltip.opacity === 0) {
        return;
    }

    if (tooltip.body) {
        const tooltipData = tooltip.dataPoints[0].raw as ChartDataValue
        const titleLines = tooltip.title || "";

        const tooltipTitle = tooltipEl.querySelector("."+styles.tooltipTitle) as HTMLElement
        const tooltipContent = tooltipEl.querySelector("."+styles.tooltipContent) as HTMLElement

        if(!tooltipContent || !tooltipTitle){
            return;
        }

        while (tooltipContent.firstChild) {
            tooltipContent.firstChild.remove();
        }
        tooltipTitle.innerText = titleLines
        tooltipContent.appendChild(createTooltipAttribute(tooltip, tooltipData))

        if(tooltipData.satellite){
            const link = document.createElement("a")
            link.className= styles.tooltipLink
            link.setAttribute("href", "/home/map?boss="+tooltipData.satellite.id)
            link.innerText = "Check map"
            tooltipContent.appendChild(link)
        }

        tooltipEl.appendChild(tooltipTitle);
        tooltipEl.appendChild(tooltipContent);

    }
    tooltipEl.style.opacity = "1";
    tooltipEl.style.font = tooltip.options.bodyFont.string;
    tooltipEl.style.padding = tooltip.options.padding + 'px ' + tooltip.options.padding + 'px';
};

function createTooltipAttribute(tooltip:TooltipModel<any>, data:ChartDataValue){
    const colors = tooltip.labelColors[0];

    const attribute = document.createElement("div")
    attribute.className = styles.tooltipContentAttribute

    const span = document.createElement('span');
    span.style.background = colors.backgroundColor.toString();
    span.style.borderColor = colors.borderColor.toString();
    span.style.borderWidth = '2px';
    span.style.height = '10px';
    span.style.width = '10px';
    span.style.display = 'inline-block';

    const tooltipText = document.createTextNode("Number of deaths: "+data.value);

    attribute.appendChild(span)
    attribute.appendChild(tooltipText)
    return attribute
}