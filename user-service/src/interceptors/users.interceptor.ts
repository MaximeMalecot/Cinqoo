import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
} from "@nestjs/common";
import { map, Observable } from "rxjs";

@Injectable()
export class PasswordInterceptor implements NestInterceptor {
    public intercept(
        context: ExecutionContext,
        next: CallHandler
    ): Observable<any> {
        return next.handle().pipe(
            map((value) => {
                if (
                    typeof value === "object" &&
                    value !== null &&
                    "password" in value
                ) {
                    const { password, ...valueWithoutPassword } = value;

                    return valueWithoutPassword;
                }

                if (
                    Array.isArray(value) &&
                    value.every(
                        (item) =>
                            typeof item === "object" &&
                            item !== null &&
                            "password" in item
                    )
                ) {
                    return value.map(({ password, ...itemWithoutPassword }) => {
                        return itemWithoutPassword;
                    });
                }
            })
        );
    }
}
