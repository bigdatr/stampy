// @flow
import classnames from 'classnames';

type ClassNameProps = {
    name: string,
    modifier: ?string,
    className: ?string
}

export default function ComponentClassNames(props: ClassNameProps, ...args: Array<void>): string {
    return classnames(
        props.name,
        (props.modifier)
            ? props
                .modifier
                .split(' ')
                .map(mm => `${props.name}-${mm}`)
            : null,
        args,
        props.className
    );
}
