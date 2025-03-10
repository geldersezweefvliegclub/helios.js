import {IsInt, IsOptional} from "class-validator";
import {Type} from "class-transformer";
import {
   OptionalBooleanTransform,
   OptionalNumberTransform,
   CSVTransform,
   OptionalDateTransform
} from "../helpers/Transformers";
import {ApiProperty} from "@nestjs/swagger";

// class as query parameter to get a single object
export class GetObjectRequest
{
   @IsInt()
   @Type(() => Number)
   @ApiProperty(
      {
         name: 'ID',
         required: true,
         type: Number
      })
   public ID: number;
}

// base class as query parameter to get multiple objects via the GetObjects call
export class GetObjectsRequest
{
   @IsOptional()
   @OptionalNumberTransform()
   @ApiProperty(
      {
         name: 'ID',
         description: 'Enkel ID ophalen',
         required: false,
         type: Number
      })
   public ID?: number;

   @IsOptional()
   @CSVTransform()
   @ApiProperty(
      {
         name: 'IDs',
         description: 'Comma separated lijst van IDs',
         required: false,
         type: String
      })
   public IDs?: number[];

   @IsOptional()
   @OptionalBooleanTransform()
   @ApiProperty(
      {
         name: 'VERWIJDERD',
         description: 'Als "true", dan worden alleen de verwijderde records opgehaald',
         required: false,
         type: Boolean
      })
   public VERWIJDERD?: boolean;

   @IsOptional()
   @ApiProperty(
      {
         name: 'HASH',
         description: 'Hash van de data. Als de hash hetzelfde is als de hash van de data, dan is komt HTTP 304 terug.',
         required: false,
         type: String
      })
   public HASH?: string;

   @IsOptional()
   @IsOptional()
   @ApiProperty(
      {
         name: 'SORT',
         description: 'Sorteer volgorde als CSV lijst. Bijvoorbeeld: "LIDTYPE, ID DESC"',
         required: false,
         type: String
      })
   public SORT?: string;

   @IsOptional()
   @OptionalNumberTransform()
   @ApiProperty(
      {
         name: 'MAX',
         description: 'Maximaal aantal records',
         required: false,
         type: Number
      })
   public MAX?: number;

   @IsOptional()
   @OptionalNumberTransform()
   @ApiProperty(
      {
         name: 'START',
         description: 'Start record',
         required: false,
         type: Number
      })
   public START?: number;

   @IsOptional()
   @ApiProperty(
      {
         name: 'VELDEN',
         description: 'Niet meer in gebruik, aanwezig voor compatiblity',
         required: false,
         type: String
      })
   public VELDEN?: string;
}


export interface IVanTotDatum {
   startTime: Date;
   endTime: Date;
   startDate: Date;
   endDate: Date;
}

// The generic class when a DATUM field is available in the object
export class GetObjectsDateRequest extends GetObjectsRequest
{
   @IsOptional()
   @OptionalDateTransform()
   @ApiProperty(
      {
         name: 'DATUM',
         required: false,
         type: Date
      })
   public DATUM?: Date;

   @IsOptional()
   @OptionalDateTransform()
   @ApiProperty(
      {
         name: 'BEGIN_DATUM',
         required: false,
         type: Date
      })
   public BEGIN_DATUM?: Date;

   @IsOptional()
   @OptionalDateTransform()
   @ApiProperty(
      {
         name: 'EIND_DATUM',
         required: false,
         type: Date
      })
   public EIND_DATUM?: Date;

   VanTot(datum: Date, beginDatum: Date, eindDatum: Date): IVanTotDatum
   {
      // begin en einde van het lopende jaar
      const Jan1 = new Date(new Date().getFullYear(), 0,1,0,0,0,0)
      const Dec31 = new Date(new Date().getFullYear(), 11,31,23,59,59,999)

      // opvragen voor een specifieke datum
      const startTime = datum ? new Date(new Date(datum).setHours(0, 0, 0, 0)) : Jan1;
      const endTime = datum ? new Date(new Date(datum).setHours(23, 59, 59, 999)) : Dec31;

      // opvragen voor een periode
      const startDate = beginDatum ? new Date(new Date(beginDatum).setHours(0, 0, 0, 0)) : Jan1;
      const endDate = eindDatum ? new Date(new Date(eindDatum).setHours(23, 59, 59, 999)) : Dec31;

      return {startTime, endTime, startDate, endDate};
   }
}

