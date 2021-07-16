import * as d3 from 'd3';

const PieView = (props) => {
    const data = props.data;
    let dataset = [];

    data.vaccineCompanies.forEach(item => {
        var vaccineCompany = {
            "vaccine": item.vaccine,
            "totalVaccinations": item.totalVaccinations
        }
        dataset.push(vaccineCompany)
    });
    console.log(dataset)
    d3.select('.vaccine-piechart > *').remove();
    const margin = { top: 20, right: 20, bottom: 30, left: 40 };
    const width = props.width - margin.left - margin.right;
    const height = props.height - margin.top - margin.bottom;

    let svg = d3.select('.vaccine-piechart')
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', 'translate(' + (width / 2 + margin.left) + ',' + (height / 2 + margin.top) + ')');

    let radius = Math.min(width, height) / 2;

    let color = d3.scaleOrdinal()
        .range(d3['schemeSet3']);

    let arc = d3.arc()
        .innerRadius(0)
        .outerRadius(radius);

    let pie = d3.pie()
        .value(d => d.totalVaccinations)
        .sort(null);

    const arcMoveEnter = (d) => {
        var i = d3.interpolate(d.endAngle, d.startAngle)
        return function (t) {
            d.startAngle = i(t);
            return arc(d)
        }
    }

    svg.selectAll('path')
        .data(pie(dataset))
        .enter()
        .append('path')
        .attr('stroke', '#fff')
        .attr('stroke-width', 1)
        .attr('fill', function (d, i) {
            return color(i);
        })
        .transition().duration(800)
        .attrTween('d', arcMoveEnter);

    var size = 20
    svg.selectAll(".legend")
        .data(pie(dataset))
        .enter()
        .append("rect")
        .attr("x", -120)
        .attr("y", function (d, i) { return 130 + i * (size + 5) }) // 100 is where the first dot appears. 25 is the distance between dots
        .attr("width", size)
        .attr("height", size)
        .style("fill", (d, i) => {
            return color(i)
        })

    svg.selectAll(".legend")
        .data(pie(dataset))
        .enter()
        .append("text")
        .attr("x", -120 + size * 1.2)
        .attr("y", function (d, i) { return 133 + i * (size + 5) + (size / 2) }) // 100 is where the first dot appears. 25 is the distance between dots
        .style("fill", '#ff')
        .text(function (d) { return d.data.vaccine })
        .attr("text-anchor", "right")
        .style("alignment-baseline", "middle")
}

export default PieView;