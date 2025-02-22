interface ProblematicComponentProps {
    energy: number;
}

function EnergyComponent(props: ProblematicComponentProps) {
    if (props.energy < 0) {
        throw new Error('La energía no puede ser negativa, y es ' + props.energy);
    }
        return (
        <div>Energía: {props.energy}</div>
        )
}

export default EnergyComponent;